import { S3, config } from 'aws-sdk';

config.update({ region: 'eu-west-1', signatureVersion: 'v4' });

const bucketName = process.env.BUCKET_NAME;
const s3 = new S3();

export const getList = async () => {
  try {
    return await s3
      .listObjectsV2({ Bucket: bucketName, Prefix: 'uploaded', Delimiter: '/' })
      .promise();
  } catch (error) {
    throw new Error(error);
  }
};

export const getReadableStream = async (filename: string) => {
  try {
    return await s3
      .getObject({ Bucket: bucketName, Key: `uploaded/${filename}` })
      .createReadStream();
  } catch (error) {
    throw new Error(error);
  }
};

export const getSignedUrl = async (filename: string) => {
  try {
    return await s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      Key: `uploaded/${filename}`,
      ContentType: 'text/csv',
      Expires: 60,
    });
  } catch (error) {
    throw new Error(error);
  }
};
