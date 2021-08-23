import * as fs from 'fs';
import * as AWSMock from 'aws-sdk-mock';
import context from 'aws-lambda-mock-context';
import { Callback } from 'aws-lambda';
import { main as getProductsList } from './handler';

import mock from './mock.json';

AWSMock.mock('S3', 'getObject', Buffer.from(fs.readFileSync(`${__dirname}/mock.json`, 'utf-8')));

const event = {};
const ctx = context();
const callback: Callback = () => {};

describe('getProductsList', () => {
  afterEach(() => {
    AWSMock.restore('S3');
  });

  test('Returns array of products', async () => {
    const result = await getProductsList(event, ctx, callback);
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify(mock) });
  });
});
