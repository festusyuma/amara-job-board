#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const ec2 = require('aws-cdk-lib/aws-ec2');
const dynamo = require('aws-cdk-lib/aws-dynamodb');
const { FullStackConstruct } = require('@fy-stack/fullstack-construct');
const { AppType, AppGrant } = require('@fy-stack/types');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');

const MessageType = {
  JOB_POSTED: 'JOB_POSTED',
  JOB_UPDATED: 'JOB_UPDATED',
  JOB_PARSED: 'JOB_PARSED',
  JOB_APPLICATION: 'JOB_APPLICATION',
  JOB_APPLICATION_PARSED: 'JOB_APPLICATION_PARSED',
  JOB_BOARD_UPDATED: 'JOB_BOARD_UPDATED',
  JOB_SYNC_UPDATED: 'JOB_SYNC_UPDATED',
};

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const environment = process.env.ENVIRONMENT;
if (!environment) throw new Error('ENVIRONMENT is required');

const appName = 'amara';

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const dataPipelineTable = new dynamo.Table(this, 'DataPipelineTable', {
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    const app = new FullStackConstruct(this, 'App', {
      environment,
      name: appName,
      ownerArn: props.ownerArn,
      storage: { retainOnDelete: false },
      ecs: {
        server: {
          assignPublicIp: true,
          apps: {
            server: {
              type: AppType.IMAGE_APP,
              output: './apps/server',
              port: 3001,
              container: {
                command: ['node', 'main.js'],
              },
            },
          },
          grants: [AppGrant.EVENT, AppGrant.SECRET],
        },
      },
      lambda: {
        serverEvent: {
          type: AppType.IMAGE_APP,
          output: './apps/server',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          buildParams: {
            container: {
              command: ['node', 'main.js'],
            },
          },
          queue: {},
        },
        analytics: {
          type: AppType.NODE_APP,
          output: './services/analytics',
          grants: [AppGrant.SECRET],
          queue: {},
          buildParams: {
            container: {
              command: ['node', 'main.js'],
            },
          },
        },
        dataPipeline: {
          type: AppType.NODE_APP,
          output: './services/data-pipeline',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          queue: {},
          buildParams: {
            container: {
              command: ['node', 'main.js'],
            },
          },
        },
        jobBoard: {
          type: AppType.IMAGE_APP,
          output: './services/job-board',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          queue: {},
          buildParams: {
            container: {
              command: ['node', 'main.js'],
            },
          },
        },
      },
      secret: {
        GEMINI_KEY: process.env.GEMINI_KEY,
      },
      event: {
        handlers: [
          {
            messages: [
              MessageType.JOB_APPLICATION,
              MessageType.JOB_PARSED,
              MessageType.JOB_SYNC_UPDATED,
            ],
            $resource: 'analytics',
          },
          {
            messages: [
              MessageType.JOB_APPLICATION,
              MessageType.JOB_POSTED,
              MessageType.JOB_UPDATED,
            ],
            $resource: 'dataPipeline',
          },
          {
            messages: [MessageType.JOB_POSTED, MessageType.JOB_UPDATED],
            $resource: 'jobBoard',
          },
        ],
      },
    });

    const server = app.ecs.server;
    if (server) {
      const publicSecurityGroup = new ec2.SecurityGroup(this, 'PublicSG', {
        allowAllOutbound: true,
        vpc: app.vpc,
      });

      server.service.connections.addSecurityGroup(publicSecurityGroup);
    }

    const dataPipeline = app.lambda.apps.dataPipeline;
    if (dataPipeline) {
      dataPipelineTable.grant(dataPipeline.function);
    }
  }
}

(async () => {
  const sts = new STSClient();
  const res = await sts.send(new GetCallerIdentityCommand());
  if (!res.Arn) throw new Error('caller not found');

  const app = new cdk.App();
  const stackName = `${appName}-${environment}`;

  new AppStack(app, stackName, {
    env,
    stackName,
    ownerArn: res.Arn,
  });
})();
