import { Client, ClientConfig } from 'pg';
import { ProductWithStock } from '@models/product';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const create = async (product: ProductWithStock) => {
  const { title, description, price, count } = product;

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

    return product.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.end();
  }
};
