import 'source-map-support/register';

import { getProductsMock } from '@libs/s3';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const getProductsList = async () => {
  const json = await getProductsMock();
  const products = JSON.parse(json);

  return formatJSONResponse({
    data: products?.data,
  });
};

export const main = middyfy(getProductsList);
