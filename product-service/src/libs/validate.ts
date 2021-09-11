import { ProductWithStock } from '@models/product';

export const validate = ({ title, description, price, count }: ProductWithStock) => {
  if (!title || typeof title !== 'string') {
    return { error: { message: '"title" is invalid' } };
  }
  if (!description || typeof description !== 'string') {
    return { error: { message: '"description" is invalid' } };
  }
  if (price === null || price === undefined || typeof price !== 'number') {
    return { error: { message: '"price" is invalid' } };
  }
  if (count === null || count === undefined || typeof count !== 'number' || count < 1) {
    return { error: { message: '"count" is invalid' } };
  }
  return {};
};
