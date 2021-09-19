import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getList, getReadableStream } from '@libs/s3';

const importProductsFile = async (event) => {
  console.log(event);
  const fileName = event.queryStringParameters?.name;

  const files = await getList();

  const stream = await getReadableStream(fileName);

  console.log(files, stream);

  return formatJSONResponse({
    message: `It works`,
    event,
  });
};

export const main = middyfy(importProductsFile);
