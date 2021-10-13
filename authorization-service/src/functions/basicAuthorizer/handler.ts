import 'source-map-support/register';

import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, ctx, cb) => {};

export const main = middyfy(basicAuthorizer);
