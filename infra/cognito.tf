resource "aws_cognito_user_pool" "pool" {
  name = "user-pool"

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Welcome to Pantree"
    email_message        = "Use this code to confirm your email: {####}"
  }

  password_policy {
    minimum_length    = 6
    require_uppercase = false
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
  }
}

resource "aws_cognito_user_pool_client" "web" {
  name         = "frontend-client"
  user_pool_id = aws_cognito_user_pool.pool.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH"
  ]

  refresh_token_rotation {
    feature                    = "ENABLED"
    retry_grace_period_seconds = 10
  }
}

output "user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.web.id
  description = "Cognito App Client ID"
}