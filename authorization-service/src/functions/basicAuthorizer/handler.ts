import 'source-map-support/register';

import { APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

const generatePolicy = (principalId: string, resource: string, effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  } as PolicyDocument,
});

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _ctx, cb) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    console.log(`Username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    console.log(error);
    cb(`Unathorized: ${error.message}`);
  }
};

export const main = middyfy(basicAuthorizer);
