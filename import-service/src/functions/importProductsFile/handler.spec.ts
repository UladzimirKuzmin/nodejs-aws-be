import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { importProductsFile } from './handler';

jest.mock('aws-sdk', () => ({
  config: { update: jest.fn() },
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn().mockResolvedValue('https://example.com'),
  })),
}));

const event = {} as unknown as APIGatewayProxyEvent;
const ctx = {} as Context;
const callback: Callback = () => {};

describe('importProductsFile', () => {
  test('returns pre-signed url', async () => {
    const result = await importProductsFile(event, ctx, callback);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ url: 'https://example.com' }),
    });
  });
});
