import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { connect } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductsList: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  let client: Client;

  try {
    client = await connect();

    const products = await client.query<Product>(
      `SELECT id, title, description, price, count
      FROM products
      LEFT JOIN stocks ON products.id = stocks.product_id`,
    );

    return formatJSONResponse({
      data: products.rows,
    });
  } catch (error) {
    return error;
  } finally {
    await client.end();
  }
};

export const main = middyfy(getProductsList);
