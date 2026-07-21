import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Dashboard, GraphWidget, Metric, TextWidget } from 'aws-cdk-lib/aws-cloudwatch';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export interface MonitoringStackProps extends StackProps {
  alarmEmail?: string;
}

export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props?: MonitoringStackProps) {
    super(scope, id, props);

    const dashboard = new Dashboard(this, 'VoiceAgentDashboard', {
      dashboardName: 'VoiceAgent-Runtime',
    });

    dashboard.addWidgets(
      new TextWidget({ markdown: '# Voice Agent Runtime Dashboard', width: 24, height: 1 }),
      new GraphWidget({
        title: 'WebSocket Connection Count',
        left: [new Metric({ namespace: 'AWS/ApiGateway', metricName: 'ConnectionCount', statistic: 'Sum' })],
        width: 12,
      }),
      new GraphWidget({
        title: 'Bedrock Invocation Latency',
        left: [new Metric({ namespace: 'AWS/Bedrock', metricName: 'InvocationLatency', statistic: 'Average' })],
        width: 12,
      }),
      new GraphWidget({
        title: 'Lambda Errors',
        left: [new Metric({ namespace: 'AWS/Lambda', metricName: 'Errors', statistic: 'Sum' })],
        width: 12,
      }),
      new GraphWidget({
        title: 'ECS CPU Utilization',
        left: [new Metric({ namespace: 'AWS/ECS', metricName: 'CPUUtilization', statistic: 'Average' })],
        width: 12,
      }),
    );

    if (props?.alarmEmail) {
      const alarmTopic = new Topic(this, 'AlarmTopic', { displayName: 'VoiceAgent Alarms' });
      alarmTopic.addSubscription(new EmailSubscription(props.alarmEmail));

      dashboard.addWidgets(
        new TextWidget({ markdown: '---\n**Alarms configured:** Error rate > 5% in 5min, Latency > 5s p99', width: 24, height: 1 }),
      );
    }
  }
}