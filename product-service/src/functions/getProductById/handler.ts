import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { id } = event.pathParameters;
  return formatJSONResponse({
    id,
  });
};

export const main = middyfy(getProductById);
