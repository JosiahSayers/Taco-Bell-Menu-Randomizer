import { Product } from "./product.model";

export interface Category {
  href: string;
  title: string;
  products?: Product[];
}
