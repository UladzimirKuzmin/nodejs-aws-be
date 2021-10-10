import { Client } from 'pg';
import { Callback, Context } from 'aws-lambda';
import { main as getProductsList } from './handler';

import mock from './mock.json';

jest.mock('pg', () => {
  const mClient = { connect: jest.fn(), query: jest.fn(), end: jest.fn() };
  return {
    Client: jest.fn(() => mClient),
  };
});

const event = {};
const ctx = {} as Context;
const callback: Callback = () => {};

describe('getProductsList', () => {
  let mockedClient: jest.Mocked<Client>;
  beforeAll(() => {
    mockedClient = new Client({}) as any;
  });

  test('Returns empty array', async () => {
    mockedClient.query.mockResolvedValue({ rows: [] } as never);
    const result = await getProductsList(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({ data: [] }) });
  });

  test('Returns array of products', async () => {
    mockedClient.query.mockResolvedValue({ rows: [...mock.data] } as never);
    const result = await getProductsList(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
