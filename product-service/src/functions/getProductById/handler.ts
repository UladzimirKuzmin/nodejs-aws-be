import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { getProductsMock } from '@libs/s3';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { id } = event.pathParameters;

  const json = await getProductsMock();
  const products = JSON.parse(json);

  const product = products?.data.find((entry) => entry.id === Number(id));

  return formatJSONResponse(product ?? {});
};

export const main = middyfy(getProductById);
