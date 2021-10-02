import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      excludeFiles: '**/*.spec.ts',
    },
  },
  useDotenv: true,
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: 'catalogItemsQueue',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: 'arn:aws:s3:::nodejs-aws-be-import',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: 'arn:aws:s3:::nodejs-aws-be-import/*',
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: [
          {
            'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
          },
        ],
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'product-service-catalog-batch-process',
        },
      },
    },
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
