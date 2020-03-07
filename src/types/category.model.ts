import { Product } from "./product.model";

export interface Category {
  href: string;
  title: String;
  items: Product[];
}
