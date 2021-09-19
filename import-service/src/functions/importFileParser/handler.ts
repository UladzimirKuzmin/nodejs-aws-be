import 'source-map-support/register';

import type { S3Handler } from 'aws-lambda';
import * as csvParser from 'csv-parser';
import * as util from 'util';
import * as stream from 'stream';
import { middyfy } from '@libs/lambda';
import { getReadableStream, getCopyObject } from '@libs/s3';

const finished = util.promisify(stream.finished);

const importFileParser: S3Handler = async (event) => {
  console.log(event);

  event.Records.forEach(async (record) => {
    const results = [];
    const s3Stream = await getReadableStream(record.s3.object.key);

    await finished(
      s3Stream
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(data);
          results.push(data);
        })
        .on('end', async () => {
          await getCopyObject(record.s3.object.key);
          console.log('Copied to parsed folder');
        }),
    );
  });
};

export const main = middyfy(importFileParser);
