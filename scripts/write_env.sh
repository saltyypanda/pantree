APP_ENV_FILE="../.env"

cat > "$APP_ENV_FILE" <<EOF
# Cognito
EXPO_PUBLIC_COGNITO_USER_POOL_ID=$(terraform output -raw user_pool_id)
EXPO_PUBLIC_COGNITO_CLIENT_ID=$(terraform output -raw user_pool_client_id)

# Database connection (non-secret values)
DB_NAME=$(terraform output -raw db_name)
DB_HOST=$(terraform output -raw db_endpoint)
DB_PORT=$(terraform output -raw db_port)
DB_SECRET_ARN=$(terraform output -raw db_secret_arn)
EOF