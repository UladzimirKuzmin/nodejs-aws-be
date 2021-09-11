import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { dbOptions } from '@libs/db';
import { formatJSONResponse, format404Response } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { id } = event.pathParameters;

  const client = new Client(dbOptions);

  try {
    await client.connect();

    const product = await client.query<Product>(
      `SELECT id, title, description, price, count
      FROM products
      LEFT JOIN stocks ON products.id = stocks.product_id
      WHERE products.id = $1`,
      [id],
    );

    if (!product.rows.length) {
      return format404Response();
    }

    return formatJSONResponse(product.rows[0]);
  } catch (error) {
    return error;
  } finally {
    await client.end();
  }
};

export const main = middyfy(getProductById);
