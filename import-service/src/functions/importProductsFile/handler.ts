import 'source-map-support/register';

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getSignedUrl } from '@libs/s3';

const importProductsFile: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  console.log(event);

  const filename = event.queryStringParameters?.name;
  let url: string;

  try {
    url = await getSignedUrl(filename);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }

  return formatJSONResponse({ url });
};

export const main = middyfy(importProductsFile);
