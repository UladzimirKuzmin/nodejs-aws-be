import 'source-map-support/register';

import { connect } from '@libs/db';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductsList = async () => {
  const client = await connect();

  try {
    const products = await client.query<Product>(
      `SELECT id, title, description, price, count FROM products LEFT JOIN stocks ON products.id = stocks.product_id`,
    );

    return formatJSONResponse({
      data: products.rows,
    });
  } catch (error) {
    return `Server failed with the following error: ${error}`;
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);
