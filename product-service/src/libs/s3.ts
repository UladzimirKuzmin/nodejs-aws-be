import { S3, config } from 'aws-sdk';

config.update({ region: 'eu-west-1' });

const s3 = new S3();

export const getProductsMock = async () => {
  try {
    const response = await s3
      .getObject({ Bucket: 'nodejs-aws-be-mocks', Key: 'products.json' })
      .promise();
    return response.Body.toString('utf-8');
  } catch (error) {
    return error;
  }
};
