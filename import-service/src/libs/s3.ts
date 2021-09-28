import { S3, config } from 'aws-sdk';

config.update({ region: 'eu-west-1', signatureVersion: 'v4' });

const s3 = new S3();

export const getList = async () => {
  try {
    return await s3
      .listObjectsV2({ Bucket: 'nodejs-aws-be-import', Prefix: 'uploaded', Delimiter: '/' })
      .promise();
  } catch (error) {
    throw error;
  }
};

export const getReadableStream = async (key: string) => {
  try {
    return await s3.getObject({ Bucket: 'nodejs-aws-be-import', Key: key }).createReadStream();
  } catch (error) {
    throw error;
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
    throw error;
  }
};

export const getCopyObject = async (key: string) => {
  try {
    return await s3
      .copyObject({
        Bucket: 'nodejs-aws-be-import',
        CopySource: `nodejs-aws-be-import/${key}`,
        Key: key.replace('uploaded', 'parsed'),
      })
      .promise();
  } catch (error) {
    throw error;
  }
};

export const getDeleteObject = async (key: string) => {
  try {
    return await s3
      .deleteObject({
        Bucket: 'nodejs-aws-be-import',
        Key: key,
      })
      .promise();
  } catch (error) {
    throw error;
  }
};
