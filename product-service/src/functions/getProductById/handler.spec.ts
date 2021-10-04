import { Callback, Context } from 'aws-lambda';
import { getProductsMock } from '@libs/s3';
import { main as getProductById } from './handler';

import mock from './mock.json';

jest.mock('@libs/s3', () => ({
  getProductsMock: jest.fn(),
}));

const event = { pathParameters: { id: '1580' } };
const ctx = {} as Context;
const callback: Callback = () => {};

describe('getProductById', () => {
  (getProductsMock as jest.Mock).mockResolvedValue(JSON.stringify({ data: [mock] }));

  test.skip('Returns statusCode 404', async () => {
    const result = await getProductById({ pathParameters: { id: '999' } }, ctx, callback);
    expect(result).toEqual({ statusCode: 404 });
  });

  test.skip('Returns product object in body', async () => {
    const result = await getProductById(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
