import type { AWS } from '@serverless/typescript';
import type { GatewayResponseType } from 'aws-sdk/clients/apigateway';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const enableGatewayResponseCors = (responseType: GatewayResponseType) => {
  return {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      RestApiId: {
        Ref: 'ApiGatewayRestApi',
      },
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
      },
      ResponseType: responseType,
    },
  };
};

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
      SQS_URL: '${cf:product-service-dev.catalogItemsQueueUrl}',
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
        Resource: '${cf:product-service-dev.createProductTopicArn}',
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      ApiGatewayRestApi: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: {
            'Fn::Sub': '${AWS::StackName}',
          },
        },
      },
      ResponseUnauthorized: enableGatewayResponseCors('UNAUTHORIZED'),
      ResponseAccessDenied: enableGatewayResponseCors('ACCESS_DENIED'),
    },
  },
};

module.exports = serverlessConfiguration;
