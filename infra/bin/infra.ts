import { App } from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { PresignStack } from '../lib/presign-stack';
import { AgentRuntimeStack } from '../lib/agent-runtime-stack';
import { MonitoringStack } from '../lib/monitoring-stack';

const app = new App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION || 'us-east-1' };
new AuthStack(app, 'VoiceAgentAuthStack', { env });
new PresignStack(app, 'VoiceAgentPresignStack', { env });
new AgentRuntimeStack(app, 'VoiceAgentRuntimeStack', { env });
new MonitoringStack(app, 'VoiceAgentMonitoringStack', { env, alarmEmail: process.env.ALARM_EMAIL });
app.synth();
