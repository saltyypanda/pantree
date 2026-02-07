#!/bin/bash

# Run terraform
cd ./infra
echo "--- STARTING TERRAFORM ---"
terraform init
terraform apply -auto-approve

# Write output to .env
echo "--- WRITING ENV ---"
../scripts/write_env.sh

# Create test user
echo "--- CREATING TEST USER ---"
../scripts/create_test_user.sh $(terraform output -raw user_pool_id) $(terraform output -raw user_pool_client_id)