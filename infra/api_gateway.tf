resource "aws_apigatewayv2_api" "api" {
  name          = "${var.name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_authorizer" "cognito_jwt" {
  depends_on = [aws_cognito_user_pool.pool, aws_cognito_user_pool_client.client]

  name   = "${var.name}-cognito-authorizer"
  api_id = aws_apigatewayv2_api.api.id

  authorizer_type = "JWT"
  jwt_configuration {
    issuer   = "https://${aws_cognito_user_pool.pool.endpoint}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
  identity_sources = ["$request.header.Authorization"]
}

# Lambda proxy integration
resource "aws_apigatewayv2_integration" "me_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.me.invoke_arn
  integration_method = "POST" # required for Lambda proxy even for GET routes
  payload_format_version = "2.0"
}

# Route: GET /me (protected by JWT authorizer)
resource "aws_apigatewayv2_route" "me_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /me"

  target = "integrations/${aws_apigatewayv2_integration.me_integration.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_jwt.id
}
