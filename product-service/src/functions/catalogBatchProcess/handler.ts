import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

const catalogBatchProcess = async (event) => {
  console.log(event);
};

export const main = middyfy(catalogBatchProcess);
