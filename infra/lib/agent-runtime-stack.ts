import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerImage, FargateTaskDefinition, FargateService, Protocol, LogDrivers } from 'aws-cdk-lib/aws-ecs';
import { Vpc, SubnetType, Port, Peer, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class AgentRuntimeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const repo = new Repository(this, 'AgentRuntimeRepo', { repositoryName: 'voice-agent-runtime' });
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new Cluster(this, 'Cluster', { vpc });

    const logGroup = new LogGroup(this, 'ContainerLogGroup', {
      logGroupName: '/ecs/voice-agent-runtime',
      retention: RetentionDays.ONE_WEEK,
    });

    const taskRole = new Role(this, 'TaskRole', { assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com') });
    taskRole.addToPolicy(new PolicyStatement({ actions: ['bedrock:InvokeModelWithBidirectionalStream', 'bedrock:InvokeModel'], resources: ['*'] }));

    const serviceSg = new SecurityGroup(this, 'ServiceSecurityGroup', { vpc });
    serviceSg.addIngressRule(Peer.anyIpv4(), Port.tcp(8000), 'Allow WebSocket traffic');

    const taskDef = new FargateTaskDefinition(this, 'TaskDef', { taskRole });
    taskDef.addContainer('AgentContainer', {
      image: ContainerImage.fromEcrRepository(repo),
      portMappings: [{ containerPort: 8000, protocol: Protocol.TCP }],
      logging: LogDrivers.awsLogs({ streamPrefix: 'agent', logGroup }),
      environment: {
        AWS_REGION: 'us-east-1',
        LOG_LEVEL: 'INFO',
      },
    });
    const service = new FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDef,
      securityGroups: [serviceSg],
      assignPublicIp: true,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
    });

    const duckDnsFn = new Function(this, 'DuckDnsUpdater', {
      runtime: Runtime.PYTHON_3_12,
      code: Code.fromAsset('../services/duckdns-updater'),
      handler: 'src/handler.handler',
      environment: {
        ECS_CLUSTER_ARN: cluster.clusterArn,
        ECS_SERVICE_NAME: service.serviceName,
        DUCK_DOMAIN: 'johnkennedy007agent',
        DUCK_TOKEN: '320e0250-670a-433e-8c52-335c28e2dfb0',
      },
    });
    duckDnsFn.addToRolePolicy(new PolicyStatement({
      actions: ['ecs:ListTasks', 'ecs:DescribeTasks', 'ec2:DescribeNetworkInterfaces'],
      resources: ['*'],
    }));

    new Rule(this, 'DuckDnsSchedule', {
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [new LambdaFunction(duckDnsFn)],
    });
  }
}
