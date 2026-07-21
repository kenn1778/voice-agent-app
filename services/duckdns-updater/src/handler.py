import os
import json
import urllib.request
import boto3

ecs = boto3.client('ecs')
ec2 = boto3.client('ec2')

CLUSTER_ARN = os.environ['ECS_CLUSTER_ARN']
SERVICE_NAME = os.environ['ECS_SERVICE_NAME']
DUCK_DOMAIN = os.environ['DUCK_DOMAIN']
DUCK_TOKEN = os.environ['DUCK_TOKEN']

def get_task_public_ip():
    resp = ecs.list_tasks(cluster=CLUSTER_ARN, serviceName=SERVICE_NAME, desiredStatus='RUNNING')
    task_arns = resp.get('taskArns', [])
    if not task_arns:
        return None
    tasks = ecs.describe_tasks(cluster=CLUSTER_ARN, tasks=task_arns)
    for task in tasks['tasks']:
        for att in task.get('attachments', []):
            for detail in att.get('details', []):
                if detail['name'] == 'networkInterfaceId':
                    eni_id = detail['value']
                    eni = ec2.describe_network_interfaces(NetworkInterfaceIds=[eni_id])
                    pub_ip = eni['NetworkInterfaces'][0].get('Association', {}).get('PublicIp')
                    if pub_ip:
                        return pub_ip
    return None

def update_duckdns(ip):
    url = f'https://www.duckdns.org/update?domains={DUCK_DOMAIN}&token={DUCK_TOKEN}&ip={ip}'
    with urllib.request.urlopen(url) as r:
        body = r.read().decode()
    return body.strip() == 'OK'

def handler(event, context):
    ip = get_task_public_ip()
    if not ip:
        return {'status': 'no_running_tasks'}
    ok = update_duckdns(ip)
    return {'status': 'ok' if ok else 'duckdns_failed', 'ip': ip}
