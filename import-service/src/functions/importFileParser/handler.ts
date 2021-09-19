import 'source-map-support/register';

// import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
// import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
// import { getReadableStream } from '@libs/s3';

const importFileParser = async (event) => {
  console.log(event);
  return {};
};

export const main = middyfy(importFileParser);
