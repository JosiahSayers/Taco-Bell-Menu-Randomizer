import { Menu } from "../types/menu";
import fs from 'fs';
import { Logger } from './logger.service';

export function getAllPossibleValues(menu: Menu, refresh = false): PossibleItems {
  if (menu) {
    const possibleItems: PossibleItems = {
      categories: [],
      products: [],
      addons: [],
      sauces: []
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

    if (!doesFileAlreadyExist() || refresh) {
      try {
        fs.writeFileSync('./menu-possibilites.json', JSON.stringify(possibleItems), { encoding: 'utf8' });
      } catch (e) {
        Logger.error('Error writing menu possibilites to disk', undefined, e);
      }
    }

    return possibleItems;
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
  try {
    const file = fs.readFileSync('./menu-possibilites.json', { encoding: 'utf8' });
    return !!file;
  } catch (e) {
    Logger.error('Error reading menu possibilities from disk', undefined, e);
    return false;
  }
}

export interface PossibleItems {
  categories: string[],
  products: string[],
  addons: string[],
  sauces: string[]
}