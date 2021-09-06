import 'source-map-support/register';

import { getProductsMock } from '@libs/s3';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';

const getProductsList = async () => {
  try {
    const json = await getProductsMock();
    const products = JSON.parse(json) as { data: Product[] };

    return formatJSONResponse({
      data: products?.data,
    });
  } catch (error) {
    return error;
  }
};

export const main = middyfy(getProductsList);
