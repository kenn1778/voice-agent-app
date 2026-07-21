import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class PresignStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sessionsTable = new Table(this, 'SessionsTable', {
      tableName: 'voice-agent-sessions',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'sessionId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    sessionsTable.addGlobalSecondaryIndex({
      indexName: 'UserIdCreatedAtIndex',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
    });

    const presignHandler = new Function(this, 'PresignHandler', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('../services/presign-api'),
      handler: 'src/handler.handler',
      environment: { AGENT_RUNTIME_ENDPOINT: 'wss://johnkennedy007agent.duckdns.org/ws' },
    });

    const sessionHandler = new Function(this, 'SessionHandler', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('../services/session-history'),
      handler: 'src/handler.handler',
      environment: { SESSION_TABLE_NAME: sessionsTable.tableName },
    });
    sessionsTable.grantReadWriteData(sessionHandler);
    sessionHandler.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
      resources: [sessionsTable.tableArn, sessionsTable.tableArn + '/index/*'],
    }));

    const api = new HttpApi(this, 'PresignApi', { apiName: 'PresignApi' });

    api.addRoutes({ path: '/presign', methods: [HttpMethod.POST], integration: new HttpLambdaIntegration('PresignIntegration', presignHandler) });
    api.addRoutes({ path: '/sessions', methods: [HttpMethod.GET], integration: new HttpLambdaIntegration('ListSessionsIntegration', sessionHandler) });
    api.addRoutes({ path: '/sessions', methods: [HttpMethod.POST], integration: new HttpLambdaIntegration('CreateSessionIntegration', sessionHandler) });
    api.addRoutes({ path: '/sessions/{sessionId}', methods: [HttpMethod.GET], integration: new HttpLambdaIntegration('GetSessionIntegration', sessionHandler) });
    api.addRoutes({ path: '/sessions/{sessionId}', methods: [HttpMethod.PUT], integration: new HttpLambdaIntegration('UpdateSessionIntegration', sessionHandler) });
    api.addRoutes({ path: '/sessions/{sessionId}', methods: [HttpMethod.DELETE], integration: new HttpLambdaIntegration('DeleteSessionIntegration', sessionHandler) });
  }
}
