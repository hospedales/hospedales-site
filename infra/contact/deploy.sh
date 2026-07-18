#!/usr/bin/env bash
# Deploy (idempotent) of the contact Lambda + SES identity. Requires configured AWS CLI.
set -euo pipefail
cd "$(dirname "$0")"

REGION="${AWS_REGION:-us-east-1}"
FN_NAME="hospedales-contact"
ROLE_NAME="hospedales-contact-role"
EMAIL="mick@hospedales.com"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "==> SES identity (check your inbox for the verification email)"
aws sesv2 create-email-identity --region "$REGION" --email-identity "$EMAIL" 2>/dev/null ||
  echo "    identity already exists"

echo "==> IAM role"
if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]
  }'
  aws iam attach-role-policy --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name ses-send --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{"Effect": "Allow", "Action": ["ses:SendEmail"], "Resource": "*"}]
  }'
  echo "    waiting for role propagation" && sleep 12
fi

echo "==> Lambda function"
zip -j /tmp/contact.zip handler.mjs
if aws lambda get-function --function-name "$FN_NAME" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN_NAME" --region "$REGION" \
    --zip-file fileb:///tmp/contact.zip >/dev/null
else
  aws lambda create-function --function-name "$FN_NAME" --region "$REGION" \
    --runtime nodejs22.x --handler handler.handler \
    --role "arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}" \
    --zip-file fileb:///tmp/contact.zip \
    --environment "Variables={CONTACT_TO=${EMAIL},CONTACT_FROM=${EMAIL}}" >/dev/null
fi

# NOTE: since Oct 2025, function URLs need BOTH InvokeFunctionUrl and InvokeFunction grants.
echo "==> Function URL + public permissions (idempotent)"
aws lambda create-function-url-config --function-name "$FN_NAME" --region "$REGION" \
  --auth-type NONE --cors \
  'AllowOrigins=https://www.hospedales.com,http://localhost:4321,AllowMethods=POST,AllowHeaders=content-type' \
  2>/dev/null || echo "    function url already exists"
aws lambda add-permission --function-name "$FN_NAME" --region "$REGION" \
  --statement-id FunctionURLAllowPublicAccess --action lambda:InvokeFunctionUrl \
  --principal '*' --function-url-auth-type NONE 2>/dev/null || echo "    url permission already exists"
aws lambda add-permission --function-name "$FN_NAME" --region "$REGION" \
  --statement-id FunctionURLInvokeFunction --action lambda:InvokeFunction \
  --principal '*' 2>/dev/null || echo "    invoke permission already exists"

echo "==> Function URL:"
aws lambda get-function-url-config --function-name "$FN_NAME" --region "$REGION" \
  --query FunctionUrl --output text
