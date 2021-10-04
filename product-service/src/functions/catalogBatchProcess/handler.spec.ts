import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { create } from '@libs/db';
import { catalogBatchProcess } from './handler';

const mockProduct = {
  title: 'Test',
  description: 'Test description',
  count: 0,
  price: 0,
};

jest.mock('aws-sdk', () => {
  const mSNS = { publish: jest.fn().mockReturnValue({ promise: jest.fn() }) };
  return {
    SNS: jest.fn(() => mSNS),
  };
});

jest.mock('@libs/db', () => ({
  create: jest.fn(),
}));

describe('CatalogBatchProcess', () => {
  const mockCreatedProduct = {
    ...mockProduct,
    id: '1',
  };

  let mockedSNS: jest.Mocked<SNS>;
  beforeAll(() => {
    mockedSNS = new SNS() as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct status code', async () => {
    (create as jest.Mock).mockResolvedValue(mockCreatedProduct);
    const mockEvent = { Records: [{ body: JSON.stringify(mockProduct) }] };
    const result = await catalogBatchProcess(mockEvent as SQSEvent);
    expect(result.statusCode).toBe(200);
  });

  test('should call create product correct times', async () => {
    const mockEvent = {
      Records: [{ body: JSON.stringify(mockProduct) }, { body: JSON.stringify(mockProduct) }],
    };
    await catalogBatchProcess(mockEvent as SQSEvent);
    expect(mockedSNS.publish).toHaveBeenCalledTimes(2);
  });

  test('should return error when database error occurred', async () => {
    (create as jest.Mock).mockRejectedValue(new Error('Test error'));
    const mockEvent = { Records: [{ body: JSON.stringify(mockProduct) }] };
    const result = await catalogBatchProcess(mockEvent as SQSEvent);
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'Test error' }),
    });
  });
});
