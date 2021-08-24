import context from 'aws-lambda-mock-context';
import { Callback } from 'aws-lambda';
import { getProductsMock } from '@libs/s3';
import { main as getProductById } from './handler';

import mock from './mock.json';

jest.mock('@libs/s3', () => ({
  getProductsMock: jest.fn(),
}));

const event = { pathParameters: { id: '1580' } };
const ctx = context();
const callback: Callback = () => {};

describe('getProductsList', () => {
  (getProductsMock as jest.Mock).mockResolvedValue(JSON.stringify({ data: [mock] }));

  test('Returns empty object in body', async () => {
    const result = await getProductById({ pathParameters: { id: '999' } }, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({}) });
  });

  test('Returns product object in body', async () => {
    const result = await getProductById(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
