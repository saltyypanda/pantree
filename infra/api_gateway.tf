resource "aws_apigatewayv2_api" "api" {
  name          = "pantree-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_authorizer" "recipe_app_authorizer" {
  depends_on = [aws_cognito_user_pool.pool, aws_cognito_user_pool_client.client]

  name   = "cognito-authorizer"
  api_id = aws_apigatewayv2_api.api.id

  authorizer_type = "JWT"
  jwt_configuration {
    issuer   = "https://${aws_cognito_user_pool.pool.endpoint}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
  identity_sources = ["$request.header.Authorization"]
}

# 1. THE DUMMY TARGET (No Lambda required)
# This points to a public "echo" service.
resource "aws_apigatewayv2_integration" "test_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "HTTP_PROXY"
  integration_method = "GET"
  integration_uri    = "https://httpbin.org/get"
}

# 2. THE PROTECTED ROUTE
# This attaches the Authorizer to the dummy target.
resource "aws_apigatewayv2_route" "auth_test_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /auth-test"

  # The "Target" is where the request goes (httpbin)
  target    = "integrations/${aws_apigatewayv2_integration.test_integration.id}"

  # The "Guard" is the Cognito Authorizer
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.recipe_app_authorizer.id
}