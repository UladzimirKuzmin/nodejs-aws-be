import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { dbOptions } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ProductWithStock } from '@models/product';

const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  console.info(event);
  const { id } = event.pathParameters;

  const client = new Client(dbOptions);

  try {
    await client.connect();

    const product = await client.query<ProductWithStock>(
      `SELECT id, title, description, price, count
      FROM products
      LEFT JOIN stocks ON products.id = stocks.product_id
      WHERE products.id = $1`,
      [id],
    );

    if (!product.rows.length) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }

    return formatJSONResponse(product.rows[0]);
  } catch (error) {
    return formatJSONResponse(error, 500);
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductById);
