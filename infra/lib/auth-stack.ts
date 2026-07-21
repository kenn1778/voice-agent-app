import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  UserPool, UserPoolClient, UserPoolClientIdentityProvider, OAuthScope,
  CfnIdentityPool, CfnIdentityPoolRoleAttachment,
} from 'aws-cdk-lib/aws-cognito';
import { Role, FederatedPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class AuthStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  public readonly identityPoolId: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      standardAttributes: { email: { required: true, mutable: true } },
      passwordPolicy: { minLength: 8, requireSymbols: true },
      accountRecovery: UserPool.ACCOUNT_RECOVERY.EMAIL_ONLY,
    });
    this.userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      oAuth: { flows: { authorizationCodeGrant: true }, scopes: [OAuthScope.OPENID, OAuthScope.EMAIL] },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      generateSecret: false,
    });
    const identityPool = new CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [{ clientId: this.userPoolClient.userPoolClientId, providerName: this.userPool.userPoolProviderName }],
    });
    this.identityPoolId = identityPool.ref;
    const role = new Role(this, 'CognitoAuthRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
      }, 'sts:AssumeRoleWithWebIdentity'),
    });
    role.addToPolicy(new PolicyStatement({
      actions: ['bedrock:InvokeModelWithBidirectionalStream'],
      resources: ['*'],
    }));
    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: { authenticated: role.roleArn },
    });
  }
}
