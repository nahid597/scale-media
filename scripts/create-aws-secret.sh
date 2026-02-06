#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AWS Secrets Manager - Create Secret Script           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}✗ AWS CLI is not installed${NC}"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI is installed${NC}"
echo ""

# Default values
DEFAULT_SECRET_NAME="scalemedia/aws-credentials"
DEFAULT_REGION="ap-south-1"

# Prompt for inputs
read -p "Enter AWS Region [$DEFAULT_REGION]: " AWS_REGION
AWS_REGION=${AWS_REGION:-$DEFAULT_REGION}

read -p "Enter Secret Name [$DEFAULT_SECRET_NAME]: " SECRET_NAME
SECRET_NAME=${SECRET_NAME:-$DEFAULT_SECRET_NAME}

echo ""
echo -e "${YELLOW}⚠ Enter your AWS credentials (these will be stored in Secrets Manager)${NC}"
read -p "AWS Access Key ID: " ACCESS_KEY_ID
read -sp "AWS Secret Access Key: " SECRET_ACCESS_KEY
echo ""
read -p "S3 Bucket Name: " S3_BUCKET

# Create the secret JSON
SECRET_JSON=$(cat <<EOF
{
  "AWS_ACCESS_KEY_ID": "$ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY": "$SECRET_ACCESS_KEY",
  "AWS_REGION": "$AWS_REGION",
  "AWS_S3_BUCKET_NAME": "$S3_BUCKET"
}
EOF
)

echo ""
echo -e "${BLUE}Creating secret in AWS Secrets Manager...${NC}"

# Create the secret
if aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "AWS credentials for ScaleMedia application" \
    --secret-string "$SECRET_JSON" \
    --region "$AWS_REGION" 2>&1; then
    
    echo ""
    echo -e "${GREEN}✓ Secret created successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Add this to your environment variables:${NC}"
    echo "AWS_SECRETS_MANAGER_SECRET_NAME=$SECRET_NAME"
    echo "AWS_REGION=$AWS_REGION"
    echo ""
    echo -e "${YELLOW}Make sure your application has the following IAM permissions:${NC}"
    echo "- secretsmanager:GetSecretValue"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Failed to create secret${NC}"
    echo -e "${YELLOW}The secret might already exist. Try using the update script instead.${NC}"
    exit 1
fi
