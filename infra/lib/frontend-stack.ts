import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Function as CfFunction, FunctionCode, FunctionEventType } from 'aws-cdk-lib/aws-cloudfront';

export interface FrontendStackProps extends StackProps {
  userPool: UserPool;
  userPoolClientId: string;
}

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'WebAppBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'OAI');
    bucket.grantRead(originAccessIdentity);

    const basicAuthFn = new CfFunction(this, 'BasicAuthFunction', {
      code: FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var auth = request.headers.authorization;
          if (!auth || auth.value !== 'Basic ${'${env.BASIC_AUTH_CREDENTIALS}'}') {
            return {
              statusCode: 401,
              statusDescription: 'Unauthorized',
              headers: { 'www-authenticate': { value: 'Basic' } }
            };
          }
          return request;
        }
      `),
    });

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [{
          function: basicAuthFn,
          eventType: FunctionEventType.VIEWER_REQUEST,
        }],
      },
      defaultRootObject: 'index.html',
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      }],
    });

    new BucketDeployment(this, 'DeployWebApp', {
      sources: [Source.asset('../apps/mobile/dist/web')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'WebAppUrl', { value: distribution.distributionDomainName });
  }
}
