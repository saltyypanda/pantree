#!/usr/bin/env bash

# Install yum-utils
sudo yum install -y yum-utils

# Add the HashiCorp repository for Terraform
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo

# Install Terraform
sudo yum -y install terraform

# Verify Terraform installation
terraform -version

# Configure AWS CLI (interactive)
# aws configure

# aws s3 cp s3://swen514-team5/ . --recursive