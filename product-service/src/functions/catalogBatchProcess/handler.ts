import 'source-map-support/register';

import { SQSEvent } from 'aws-lambda';
import { create } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';

const catalogBatchProcess = async (event: SQSEvent) => {
  console.info(event);

  try {
    for (let record of event.Records) {
      await create(JSON.parse(record.body));
    }

    return formatJSONResponse({ message: 'SUCCESS' }, 200);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(catalogBatchProcess);
