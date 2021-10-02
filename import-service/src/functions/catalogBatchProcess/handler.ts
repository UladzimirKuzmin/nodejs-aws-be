import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

const importFileParser = async (event) => {
  console.log(event);
};

export const main = middyfy(importFileParser);
