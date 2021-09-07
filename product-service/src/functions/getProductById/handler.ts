import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { connect } from '@libs/db';
import { formatJSONResponse, format404Response } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { id } = event.pathParameters;
  const client = await connect();

  try {
    //TODO: select product by id from db using query
    const products = await client.query<Product>(`select * from products`);
    const product = products?.rows.find((entry) => entry.id === id);

    if (!product) {
      return format404Response();
    }

    return formatJSONResponse(product);
  } catch (error) {
    return error;
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductById);
