import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorisation-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      excludeFiles: '**/*.spec.ts',
    },
  },
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
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
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {},
    Outputs: {
      BasicAuthorizerLambdaFunctionQualifiedArn: {
        Export: {
          Name: {
            'Fn::Sub': '${AWS::StackName}-BasicAuthorizerArn',
          },
        },
      },
    },
  },
  functions: { basicAuthorizer },
};

module.exports = serverlessConfiguration;
