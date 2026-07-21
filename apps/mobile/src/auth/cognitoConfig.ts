import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID || '',
  ClientId: process.env.COGNITO_CLIENT_ID || '',
};

export const userPool = new CognitoUserPool(poolData);

export const cognitoConfig = {
  region: process.env.COGNITO_REGION || 'us-east-1',
  userPoolId: process.env.COGNITO_USER_POOL_ID || '',
  clientId: process.env.COGNITO_CLIENT_ID || '',
  identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID || '',
  domain: process.env.COGNITO_DOMAIN || '',
  redirectUri: process.env.COGNITO_REDIRECT_URI || 'voiceagent://callback',
};
