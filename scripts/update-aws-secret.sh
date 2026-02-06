#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AWS Secrets Manager - Update Secret Script           ║${NC}"
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
echo -e "${YELLOW}⚠ Enter your NEW AWS credentials${NC}"
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
echo -e "${BLUE}Updating secret in AWS Secrets Manager...${NC}"

# Update the secret
if aws secretsmanager update-secret \
    --secret-id "$SECRET_NAME" \
    --secret-string "$SECRET_JSON" \
    --region "$AWS_REGION" 2>&1; then
    
    echo ""
    echo -e "${GREEN}✓ Secret updated successfully!${NC}"
    echo ""
    echo -e "${YELLOW}⚠ Remember to restart your application to load the new credentials${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Failed to update secret${NC}"
    echo -e "${YELLOW}Make sure the secret exists and you have the correct permissions${NC}"
    exit 1
fi
