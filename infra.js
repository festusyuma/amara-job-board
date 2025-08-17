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
  PARSE_JOB: 'PARSE_JOB',
  JOB_PARSED: 'JOB_PARSED',
  JOB_APPLICATION: 'JOB_APPLICATION',
  JOB_APPLICATION_PARSED: 'JOB_APPLICATION_PARSED',
  JOB_BOARD_UPDATED: 'JOB_BOARD_UPDATED',
  JOB_SYNC: 'JOB_SYNC',
  JOB_SYNC_UPDATED: 'JOB_SYNC_UPDATED',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  NEW_CHAT_RESPONSE: 'NEW_CHAT_RESPONSE',
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

    const jobTable = new dynamo.Table(this, 'JobTable', {
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    const chatTable = new dynamo.Table(this, 'ChatTable', {
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    const chatMessageTable = new dynamo.Table(this, 'ChatMessageTable', {
      partitionKey: {
        name: 'id',
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
    });

    chatMessageTable.addGlobalSecondaryIndex({
      partitionKey: {
        name: 'chatId',
        type: dynamo.AttributeType.STRING,
      },
      indexName: 'by_chat',
    });

    const cacheOption = { cacheFrom: undefined, cacheTo: undefined };

    if (process.env.GITHUB_ACTIONS === 'true') {
      cacheOption.cacheTo = { type: 'gha', params: { mode: 'max' } };
      cacheOption.cacheFrom = [{ type: 'gha' }];
      cacheOption.outputs = ['type=docker'];
    }

    const app = new FullStackConstruct(this, 'App', {
      environment,
      name: appName,
      ownerArn: props.ownerArn,
      storage: { retainOnDelete: false },
      ecs: {
        // server: {
        //   assignPublicIp: true,
        //   apps: {
        //     api: {
        //       type: AppType.IMAGE_APP,
        //       output: './apps/server',
        //       port: 3001,
        //       container: {
        //         command: ['node', 'main.js'],
        //         image: { ...cacheOption },
        //       },
        //       attachment: { secret: true },
        //     },
        //   },
        //   grants: [AppGrant.EVENT, AppGrant.SECRET],
        // },
      },
      lambda: {
        serverEvent: {
          type: AppType.IMAGE_APP,
          output: './apps/server',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          buildParams: {
            container: {
              file: './event.Dockerfile',
              command: ['node', 'event.js'],
              ...cacheOption,
            },
          },
          queue: {},
          attachment: { secret: true },
        },
        analytics: {
          type: AppType.IMAGE_APP,
          output: './services/analytics',
          grants: [AppGrant.SECRET],
          queue: {},
          attachment: { secret: true },
          buildParams: {
            container: {
              ...cacheOption,
            },
          },
        },
        dataPipeline: {
          type: AppType.IMAGE_APP,
          output: './services/data-pipeline',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          queue: {},
          attachment: { secret: true },
          buildParams: {
            container: {
              ...cacheOption,
            },
          },
        },
        jobBoard: {
          type: AppType.IMAGE_APP,
          output: './services/job-board',
          grants: [AppGrant.EVENT, AppGrant.SECRET],
          queue: {},
          attachment: { secret: true },
          buildParams: {
            container: {
              ...cacheOption,
            },
          },
        },
      },
      event: {
        handlers: [
          {
            messages: [
              MessageType.JOB_POSTED,
              MessageType.JOB_PARSED,
              MessageType.JOB_SYNC_UPDATED,
              MessageType.JOB_APPLICATION,
              MessageType.NEW_CHAT_MESSAGE,
              MessageType.NEW_CHAT_RESPONSE,
            ],
            $resource: 'analytics',
          },
          {
            messages: [
              MessageType.PARSE_JOB,
              MessageType.NEW_CHAT_MESSAGE,
              MessageType.JOB_APPLICATION,
            ],
            $resource: 'dataPipeline',
          },
          {
            messages: [MessageType.JOB_PARSED],
            $resource: 'jobBoard',
          },
          {
            messages: [MessageType.NEW_CHAT_RESPONSE],
            $resource: 'serverEvent',
          },
        ],
      },
      secret: {
        GEMINI_KEY: process.env.GEMINI_KEY,
        JOB_TABLE: jobTable.tableName,
        CHAT_TABLE: chatTable.tableName,
        CHAT_MESSAGE_TABLE: chatMessageTable.tableName,
        DATABASE_URL: 'db',
      },
    });

    const server = app.ecs.server;
    if (server) {
      const publicSecurityGroup = server.service.connections.securityGroups[0];

      if (publicSecurityGroup) {
        publicSecurityGroup.addIngressRule(
          ec2.Peer.anyIpv4(),
          ec2.Port.tcp(3001)
        );
      }

      const taskRole = server.definition.taskRole;

      chatTable.grantFullAccess(taskRole);
      chatMessageTable.grantFullAccess(taskRole);
      jobTable.grantFullAccess(taskRole);
    }

    const dataPipeline = app.lambda.apps.dataPipeline;

    if (dataPipeline) {
      jobTable.grantFullAccess(dataPipeline.function);
      chatTable.grantFullAccess(dataPipeline.function);
      chatMessageTable.grantFullAccess(dataPipeline.function);
    }

    const jobBoard = app.lambda.apps.jobBoard;

    if (dataPipeline) {
      jobTable.grantFullAccess(jobBoard.function);
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
