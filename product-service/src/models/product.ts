import { Stock } from './stock';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type ProductWithStock = Product & Stock;
