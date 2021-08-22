import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const getProductsList = async () => {
  return formatJSONResponse({
    data: [],
  });
};

export const main = middyfy(getProductsList);
