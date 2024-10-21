#!/bin/bash
echo "Running Docker container from ECR..."

## 登录到 ECR

# Export variables
export AWS_ACCOUNT_ID=724758113747
export AWS_REGION=ap-northeast-1
export REPOSITORY_NAME=frontend

# 输出其他调试信息
echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"
echo "AWS_REGION: $AWS_REGION"
echo "REPOSITORY_NAME: $REPOSITORY_NAME"

echo "logining aws"

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# 从 Parameter Store 获取密钥
echo "Fetching REACT_APP_TURNSTILE_SITEKEY from Parameter Store..."
TURNSTILE_SITEKEY=$(aws ssm get-parameter --name "/myapp/turnstileSiteKey" --region $AWS_REGION --with-decryption --query "Parameter.Value" --output text)

# 输出获取到的密钥（调试用，生产中避免输出敏感信息）
echo "REACT_APP_TURNSTILE_SITEKEY: $TURNSTILE_SITEKEY"

## 拉取镜像
echo "pulling docker"
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPOSITORY_NAME:latest

docker run -d --name frontend --network my-backend-service_app-network -p 80:80 -p 443:443 -e REACT_APP_TURNSTILE_SITEKEY="$TURNSTILE_SITEKEY" $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPOSITORY_NAME:latest



echo "docker run excuted"

