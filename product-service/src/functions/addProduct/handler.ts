import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { connect } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
// import { Product } from '@models/product';

const addProduct: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const { title, description, price, count } = JSON.parse(event.body);

  let client: Client;

  try {
    client = await connect();

    console.log(title, description, price, count);

    return formatJSONResponse({});
  } catch (error) {
    return error;
  } finally {
    await client.end();
  }
};

export const main = middyfy(addProduct);
