import { S3, config } from 'aws-sdk';

config.update({ region: 'eu-west-1', signatureVersion: 'v4' });

const s3 = new S3();

export const getList = async () => {
  try {
    return await s3
      .listObjectsV2({ Bucket: 'nodejs-aws-be-import', Prefix: 'uploaded', Delimiter: '/' })
      .promise();
  } catch (error) {
    throw new Error(error);
  }
};

export const getReadableStream = async (filename: string) => {
  try {
    return await s3
      .getObject({ Bucket: 'nodejs-aws-be-import', Key: `uploaded/${filename}` })
      .createReadStream();
  } catch (error) {
    throw new Error(error);
  }
};

export const getSignedUrl = async (filename: string) => {
  try {
    return await s3.getSignedUrlPromise('putObject', {
      Bucket: 'nodejs-aws-be-import',
      Key: `uploaded/${filename}`,
      ContentType: 'text/csv',
      Expires: 60,
    });
  } catch (error) {
    throw new Error(error);
  }
};
