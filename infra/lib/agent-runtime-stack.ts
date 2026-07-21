import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerImage, FargateTaskDefinition, FargateService, Protocol } from 'aws-cdk-lib/aws-ecs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class AgentRuntimeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const repo = new Repository(this, 'AgentRuntimeRepo', { repositoryName: 'voice-agent-runtime' });
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new Cluster(this, 'Cluster', { vpc });
    const taskRole = new Role(this, 'TaskRole', { assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com') });
    taskRole.addToPolicy(new PolicyStatement({ actions: ['bedrock:InvokeModelWithBidirectionalStream', 'bedrock:InvokeModel'], resources: ['*'] }));
    const taskDef = new FargateTaskDefinition(this, 'TaskDef', { taskRole });
    taskDef.addContainer('AgentContainer', {
      image: ContainerImage.fromEcrRepository(repo),
      portMappings: [{ containerPort: 8000, protocol: Protocol.TCP }],
    });
    new FargateService(this, 'Service', { cluster, taskDefinition: taskDef });
  }
}
