import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { connect } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const addProduct: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { title, description, price, count } = JSON.parse(event.body);

  let client: Client;

  try {
    client = await connect();

    await client.query('BEGIN');

    const id = await client.query(
      `INSERT INTO
       products (title, description, price)
       VALUES ('${title}', '${description}', ${price})
       RETURNING id`,
    );

    await client.query(
      `INSERT INTO 
       stocks (product_id, count)
       VALUES ($1, $2)`,
      [id, count],
    );

    const product = await client.query<Product>(
      `SELECT id, title, description, price, count
       FROM products
       LEFT JOIN stocks ON products.id = stocks.product_id 
       WHERE products.id = $1`,
      [id],
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

export const main = middyfy(addProduct);
