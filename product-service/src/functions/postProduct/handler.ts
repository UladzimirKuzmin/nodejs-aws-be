import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import { dbOptions } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { validate } from '@libs/validate';
import { ProductWithStock } from '@models/product';

const postProduct: APIGatewayProxyHandler = async (event) => {
  console.info(event);
  const { title, description, price, count } = event.body as ProductWithStock;
  const { error } = validate({ title, description, price, count } as ProductWithStock);

  if (error) {
    return formatJSONResponse(error, 400);
  }

  const client = new Client(dbOptions);

  try {
    await client.connect();
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO products (title, description, price)
       VALUES ('${title}', '${description}', '${price}'::int)
       RETURNING id`,
    );

    await client.query(
      `INSERT INTO stocks (product_id, count)
       VALUES ('${result.rows[0].id}', '${count}'::int)`,
    );

    const product = await client.query<ProductWithStock>(
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
    return formatJSONResponse(error, 500);
  } finally {
    client.end();
  }
};

export const main = middyfy(postProduct);
