import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { getProductsMock } from '@libs/s3';
import { formatJSONResponse, format404Response } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  try {
    const { id } = event.pathParameters;

    const json = await getProductsMock();
    const products = JSON.parse(json) as { data: Product[] };

    const product = products?.data.find((entry) => entry.id === Number(id));

    if (!product) {
      return format404Response();
    }

    return formatJSONResponse(product ?? {});
  } catch (error) {
    return error;
  }
};

export const main = middyfy(getProductById);
