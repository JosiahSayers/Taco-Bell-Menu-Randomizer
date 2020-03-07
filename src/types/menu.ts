import { Category } from "./category.model";

export interface Menu {
  validUntil: Date;
  categories: Category[];
}