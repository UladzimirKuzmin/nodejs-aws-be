import 'source-map-support/register';

import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { create } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.info(event);

  const sns = new SNS({ region: 'eu-west-1' });

  try {
    for (let record of event.Records) {
      const product = JSON.parse(record.body);
      await create(product);
      await sns
        .publish({
          Subject: `${product.title} has been created.`,
          Message: JSON.stringify(product),
          TopicArn: process.env.SNS_ARN,
          MessageAttributes: {
            price: {
              DataType: 'Number',
              StringValue: `${product.price}`,
            },
          },
        })
        .promise();
    }

    return formatJSONResponse({ message: 'SUCCESS' }, 200);
  } catch (error) {
    return formatJSONResponse({ message: error.message }, 500);
  }
};

export const main = middyfy(catalogBatchProcess);
