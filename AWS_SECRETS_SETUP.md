# AWS Secrets Manager Setup Guide

## Overview

This project supports two methods for managing AWS credentials:

1. **Local Development**: Environment variables in `.env` file (not committed)
2. **Production**: AWS Secrets Manager (recommended)

## Security Best Practices

### ✅ DO:

- Use AWS Secrets Manager in production
- Use IAM roles when running on AWS (EC2, ECS, Lambda)
- Rotate credentials regularly
- Use `.env` only for local development
- Keep `.env` in `.gitignore`

### ❌ DON'T:

- Commit `.env` files with real credentials
- Hardcode credentials in source code
- Share credentials via email or chat
- Use production credentials in development

## Setup Instructions

### Option 1: Local Development (Environment Variables)

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:

   ```env
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```

3. Ensure `.env` is in `.gitignore` (already configured)

### Option 2: AWS Secrets Manager (Production)

1. Install AWS CLI and configure it:

   ```bash
   aws configure
   ```

2. Create a secret in AWS Secrets Manager:

   ```bash
   aws secretsmanager create-secret \
     --name scalemedia/aws-credentials \
     --description "AWS credentials for ScaleMedia application" \
     --secret-string '{
       "AWS_ACCESS_KEY_ID": "YOUR_ACCESS_KEY",
       "AWS_SECRET_ACCESS_KEY": "YOUR_SECRET_KEY",
       "AWS_REGION": "ap-south-1",
       "AWS_S3_BUCKET_NAME": "scale-media-prod-bucket"
     }' \
     --region ap-south-1
   ```

3. Update your environment variable to use Secrets Manager:

   ```env
   AWS_SECRETS_MANAGER_SECRET_NAME=scalemedia/aws-credentials
   AWS_REGION=ap-south-1
   ```

4. Ensure your application has IAM permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["secretsmanager:GetSecretValue"],
         "Resource": "arn:aws:secretsmanager:ap-south-1:*:secret:scalemedia/aws-credentials-*"
       }
     ]
   }
   ```

### Option 3: AWS IAM Roles (Best for AWS Infrastructure)

When running on AWS services (EC2, ECS, Lambda, etc.), use IAM roles instead:

1. Create an IAM role with S3 permissions
2. Attach the role to your service
3. Remove AWS credentials from environment variables
4. The AWS SDK will automatically use the role credentials

## Rotating Credentials

### If credentials are compromised:

1. **Immediately** disable the exposed credentials in AWS IAM Console
2. Create new credentials
3. Update AWS Secrets Manager:
   ```bash
   aws secretsmanager update-secret \
     --secret-id scalemedia/aws-credentials \
     --secret-string '{
       "AWS_ACCESS_KEY_ID": "NEW_ACCESS_KEY",
       "AWS_SECRET_ACCESS_KEY": "NEW_SECRET_KEY",
       "AWS_REGION": "ap-south-1",
       "AWS_S3_BUCKET_NAME": "scale-media-prod-bucket"
     }'
   ```
4. Restart your application

## Checking Current Configuration

The application logs will show which method is being used:

- `✓ AWS secrets loaded from Secrets Manager` - Using Secrets Manager
- Otherwise - Using environment variables

## Troubleshooting

### "Failed to initialize AWS credentials"

- Check IAM permissions for Secrets Manager
- Verify secret name matches `AWS_SECRETS_MANAGER_SECRET_NAME`
- Ensure AWS region is correct

### Local development not working

- Verify `.env` file exists and has correct values
- Check `.env` is not in `.gitignore` (wait, it should be!)
- Ensure `AWS_SECRETS_MANAGER_SECRET_NAME` is NOT set for local dev
