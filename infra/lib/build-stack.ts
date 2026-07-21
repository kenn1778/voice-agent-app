import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Project, Source, LinuxBuildImage, BuildEnvironmentVariableType } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Role, ServicePrincipal, PolicyStatement, PolicyDocument, Effect } from 'aws-cdk-lib/aws-iam';

export class BuildStack extends Stack {
  public readonly sourceBucket: Bucket;
  public readonly buildProject: Project;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.sourceBucket = new Bucket(this, 'SourceBucket', {
      bucketName: `voice-agent-build-source-${this.account}-${this.region}`,
    });

    const repo = Repository.fromRepositoryName(this, 'AgentRuntimeRepo', 'voice-agent-runtime');

    const projectRole = new Role(this, 'CodeBuildRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      inlinePolicies: {
        BuildPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:InitiateLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:CompleteLayerUpload',
                'ecr:BatchGetImage',
                'ecr:PutImage',
              ],
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
            new PolicyStatement({
              actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
            new PolicyStatement({
              actions: ['s3:GetObject', 's3:GetObjectVersion'],
              resources: [this.sourceBucket.bucketArn + '/*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    this.buildProject = new Project(this, 'AgentRuntimeBuild', {
      projectName: 'voice-agent-runtime-build',
      role: projectRole,
      source: Source.s3({ bucket: this.sourceBucket, path: 'agent-runtime.zip' }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        environmentVariables: {
          AWS_ACCOUNT_ID: { type: BuildEnvironmentVariableType.PLAINTEXT, value: this.account },
        },
      },
    });
  }
}
