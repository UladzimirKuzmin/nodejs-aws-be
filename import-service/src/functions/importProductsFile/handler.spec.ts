import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { importProductsFile } from './handler';

jest.mock('aws-sdk', () => {
  const mS3 = { getSignedUrlPromise: jest.fn() };
  return {
    config: { update: jest.fn() },
    S3: jest.fn(() => mS3),
  };
});

const event = {} as unknown as APIGatewayProxyEvent;
const ctx = {} as Context;
const callback: Callback = () => {};

describe('importProductsFile', () => {
  let mockedS3: jest.Mocked<S3>;
  beforeAll(() => {
    mockedS3 = new S3() as any;
  });

  test('returns pre-signed url', async () => {
    mockedS3.getSignedUrlPromise.mockResolvedValue('https://example.com');
    const result = await importProductsFile(event, ctx, callback);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ url: 'https://example.com' }),
    });
    jest.restoreAllMocks();
  });

  test('returns internal error', async () => {
    mockedS3.getSignedUrlPromise.mockRejectedValue(new Error('Test error'));
    const result = await importProductsFile(event, ctx, callback);
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'Test error' }),
    });
    jest.restoreAllMocks();
  });
});
