import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { dbOptions } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

interface BodyRequest {
  title: string;
  description: string;
  price: number;
  count: number;
}

const postProduct: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { title, description, price, count } = event.body as unknown as BodyRequest;

  const client = new Client(dbOptions);

  try {
    await client.connect();
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO products (title, description, price)
       VALUES ('${title}', '${description}', '${price}'::int)`,
    );

    const result = await client.query(`SELECT * FROM products WHERE title = '${title}'`);

    await client.query(
      `INSERT INTO stocks (product_id, count)
       VALUES ('${result.rows[0].id}', '${count}'::int)`,
    );

    const product = await client.query<Product>(
      `SELECT id, title, description, price, count
       FROM products
       LEFT JOIN stocks ON products.id = stocks.product_id 
       WHERE products.id = $1`,
      [result.rows[0].id],
    );

    await client.query('COMMIT');

    return formatJSONResponse(product.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    return error;
  } finally {
    await client.end();
  }
};

export const main = middyfy(postProduct);
