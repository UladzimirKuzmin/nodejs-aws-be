import { Callback, Context } from 'aws-lambda';
import { getProductsMock } from '@libs/s3';
import { main as getProductsList } from './handler';

import mock from './mock.json';

jest.mock('@libs/s3', () => ({
  getProductsMock: jest.fn(),
}));

const event = {};
const ctx = {} as Context;
const callback: Callback = () => {};

describe('getProductsList', () => {
  test.skip('Returns empty array', async () => {
    (getProductsMock as jest.Mock).mockResolvedValue(JSON.stringify({ data: [] }));
    const result = await getProductsList(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({ data: [] }) });
  });

  test.skip('Returns array of products', async () => {
    (getProductsMock as jest.Mock).mockResolvedValue(JSON.stringify(mock));
    const result = await getProductsList(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
