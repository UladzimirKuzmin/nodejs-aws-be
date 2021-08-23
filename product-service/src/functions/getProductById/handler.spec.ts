import * as fs from 'fs';
import * as AWSMock from 'aws-sdk-mock';
import context from 'aws-lambda-mock-context';
import { Callback } from 'aws-lambda';
import { main as getProductById } from './handler';

import mock from './mock.json';

AWSMock.mock('S3', 'getObject', Buffer.from(fs.readFileSync(`${__dirname}/mock.json`, 'utf-8')));

const event = { pathParameters: { id: '1580' } };
const ctx = context();
const callback: Callback = () => {};

describe('getProductsList', () => {
  afterEach(() => {
    AWSMock.restore('S3');
  });

  test('Returns empty object in body', async () => {
    const result = await getProductById({ pathParameters: { id: '999' } }, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({}) });
  });

  test('Returns product object in body', async () => {
    const result = await getProductById(event, ctx, callback);
    console.log(result);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
