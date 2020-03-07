import { Product } from "./product.model";

export interface RandomizedProduct extends Product {
  removedItems: string[];
}