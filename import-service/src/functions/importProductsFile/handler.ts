import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getSignedUrl } from '@libs/s3';

const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log(event);
  const filename = event.queryStringParameters?.name;

  try {
    const url = await getSignedUrl(filename);
    return formatJSONResponse({ url });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(importProductsFile);
