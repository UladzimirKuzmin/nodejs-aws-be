import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getSignedUrl } from '@libs/s3';

const importProductsFile = async (event) => {
  console.log(event);
  const filename = event.queryStringParameters?.name;
  const signedUrl = await getSignedUrl(filename);

  return formatJSONResponse({
    data: signedUrl,
  });
};

export const main = middyfy(importProductsFile);
