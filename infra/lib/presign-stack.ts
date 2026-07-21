import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';

export class PresignStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const handler = new Function(this, 'PresignHandler', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('../services/presign-api'),
      handler: 'src/handler.handler',
      environment: { AGENT_RUNTIME_ENDPOINT: 'wss://agent.example.com/ws' },
    });
    const api = new HttpApi(this, 'PresignApi', { apiName: 'PresignApi' });
    api.addRoutes({ path: '/presign', methods: [HttpMethod.POST], integration: new HttpLambdaIntegration('PresignIntegration', handler) });
  }
}
