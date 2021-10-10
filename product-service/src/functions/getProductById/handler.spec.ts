import { Client } from 'pg';
import { Callback, Context } from 'aws-lambda';
import { main as getProductById } from './handler';

import mock from './mock.json';

jest.mock('pg', () => {
  const mClient = { connect: jest.fn(), query: jest.fn(), end: jest.fn() };
  return {
    Client: jest.fn(() => mClient),
  };
});

const event = { pathParameters: { id: '1580' } };
const ctx = {} as Context;
const callback: Callback = () => {};

describe('getProductById', () => {
  let mockedClient: jest.Mocked<Client>;
  beforeAll(() => {
    mockedClient = new Client({}) as any;
  });

  test('Returns statusCode 404', async () => {
    mockedClient.query.mockResolvedValue({ rows: [] } as never);
    const result = await getProductById({ pathParameters: { id: '999' } }, ctx, callback);
    expect(result.statusCode).toEqual(404);
  });

  test('Returns product object in body', async () => {
    mockedClient.query.mockResolvedValue({ rows: [mock] } as never);
    const result = await getProductById(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
