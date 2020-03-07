import * as scraper from './scraper.service';
import { Product } from '../types/product.model';
import { RandomizedProduct } from '../types/randomized-product.model';
import chalk, { Chalk } from 'chalk';
import { Category } from '../types/category.model';
import { MenuItem } from '../types/menu-item.model';
import { Menu } from '../types/menu';

const categoriesToSkip = [
  'party packs',
  'party-packs',
  'sweets',
  'favorites',
  'drinks',
  'sides',
  'combos',
  'deals-and-combos'
];

export async function getMenu(): Promise<Menu> {
  let menu: Menu = {
    validUntil: new Date(),
    categories: []
  };
  
  menu.validUntil.setHours(menu.validUntil.getHours() + 12);

  try {
    menu.categories = await scraper.getCategories();
    await asyncForEach(menu.categories, async (category: Category): Promise<any> => {
      try {
        if (!Array.isArray(category.products)) {
          category.products = [];
        }
        const menuItems = await scraper.getMenuItems(category);

        await asyncForEach(menuItems, async (menuItem: MenuItem): Promise<any> => {

          try {
            const productInfo = await scraper.getProductInfo(menuItem);
            category.products.push(productInfo);
            return null;
          } catch (e) {
            console.error('Error fetching product: ' + menuItem.title, e);
            return null;
          }
        });

        return null;

      } catch (e) {
        console.error('Error fetching category: ' + category.title, e);
        return null;
      }

    });
  } catch (e) {
    console.error('Error fetching Menu!', e);
  }
  
  return menu;
}

export async function getRandomItem(menu: Menu): Promise<RandomizedProduct> {
  if (menu) {
    console.log('Item returned from cache:');
    return getRandomItemFromCache(menu);
  } else {
    console.log('Item returned from scraper:');
    return getRandomItemFromScraper();
  }
}

function getRandomItemFromCache(menu: Menu): RandomizedProduct {
  const category = getRandom<Category>(menu.categories);
  
  if (!categoriesToSkip.includes(category.title.toLocaleLowerCase())) {
    const product = getRandom<Product>(category.products);
    const randomizedItem = randomizeItemContents(product);
    
    if (!categoriesToSkip.includes(randomizedItem.category)) {
      printResult(randomizedItem);
      return randomizedItem;
    } else {
      return getRandomItemFromCache(menu);
    }
  } else {
    return getRandomItemFromCache(menu);
  }
}

async function getRandomItemFromScraper(): Promise<RandomizedProduct> {
  const categories = await scraper.getCategories();
  const category = getRandom<Category>(categories);

  if (!categoriesToSkip.includes(category.title.toLowerCase())) {
    const menuItems = await scraper.getMenuItems(category);
    const menuItem = getRandom<MenuItem>(menuItems);

    if (!categoriesToSkip.includes(menuItem.category)) {
      const productInfo = await scraper.getProductInfo(menuItem);
      const randomizedItem = await randomizeItemContents(productInfo);
      printResult(randomizedItem);
      return randomizedItem;
    } else {
      console.log('Category does not allow customizations! Looking again...');
      return getRandomItemFromScraper();
    }
  } else {
    console.log('Category does not allow customizations! Looking again...');
    return getRandomItemFromScraper();
  }
}

function randomizeItemContents(productInfo: Product): RandomizedProduct {
  const randomizedProductInfo: RandomizedProduct = {
    title: productInfo.title,
    category: productInfo.category,
    includedItems: [],
    removedItems: [],
    addons: [],
    sauces: []
  };

  productInfo.includedItems.forEach(ingredient => {
    const randomNumber = Math.random();
    if (randomNumber >= 0.15) {
      randomizedProductInfo.includedItems.push(ingredient);
    } else {
      randomizedProductInfo.removedItems.push(ingredient);
    }
  });

  productInfo.addons.forEach(addon => {
    const randomNumber = Math.random();
    if (randomNumber <= 0.20) {
      randomizedProductInfo.addons.push(addon);
    }
  });

  productInfo.sauces.forEach(sauce => {
    const randomNumber = Math.random();
    if (randomNumber <= 0.20 && randomizedProductInfo.sauces.length < 2) {
      randomizedProductInfo.sauces.push(sauce);
    }
  });

  return randomizedProductInfo;
}

function getRandom<T>(array: any[]): T {
  if (Array.isArray(array)) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

function printResult(item: RandomizedProduct) {
  console.log(chalk.blue.underline.bold(`\n${item.title}\n`));
  printArray(item.removedItems, chalk.red, '-');
  printArray(item.addons, chalk.green, '+');
  printArray(item.sauces, chalk.green, '+');
  console.log('\n');
}

function printArray(arr: any[], chalk: Chalk, append = '') {
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      console.log(chalk(append + item));
    });
  }
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
