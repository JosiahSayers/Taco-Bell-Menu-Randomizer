import { Menu } from "../types/menu";
import fs from 'fs';

export function getAllPossibleValues(menu: Menu) {
  if (!doesFileAlreadyExist()) {
    const possibleItems = {
      categories: [] as string[],
      products: [] as string[],
      addons: [] as string[],
      sauces: [] as string[]
    }

    menu.categories.forEach((category) => {
      possibleItems.categories = addItemIfNew(possibleItems.categories, category.title);

      category.products.forEach((product) => {
        possibleItems.products = addItemIfNew(possibleItems.products, product.title);

        product.addons.forEach((addon) => {
          possibleItems.addons = addItemIfNew(possibleItems.addons, addon);
        });

        product.sauces.forEach((sauce) => {
          possibleItems.sauces = addItemIfNew(possibleItems.sauces, sauce);
        });
      });
    });

    fs.writeFileSync('./menu-possibilites.json', JSON.stringify(possibleItems), { encoding: 'utf8' });
  }
}

function addItemIfNew(arr: string[], newItem: string): string[] {
  const returnArr = Array.from(arr);
  if (!arr.includes(newItem)) {
    returnArr.push(newItem);
  }
  return returnArr;
}

function doesFileAlreadyExist(): boolean {
  const file = fs.readFileSync('./menu-possibilites.json', { encoding: 'utf8' });
  return !!file;
}