import * as scraper from './scraper.service';
import { Product } from '../types/product.model';
import { RandomizedProduct } from '../types/randomized-product.model';
import chalk, { Chalk } from 'chalk';
import { Category } from '../types/category.model';
import { MenuItem } from '../types/menu-item.model';
import { Menu } from '../types/menu';
import { RandomItemParams } from '../types/random-item-params.model';

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

export async function getRandomItem(menu: Menu, options?: RandomItemParams): Promise<RandomizedProduct> {
  if (menu) {
    console.log('Item returned from cache:');
    return getRandomItemFromCache(menu, options);
  } else {
    console.log('Item returned from scraper:');
    return getRandomItemFromScraper(options);
  }
}

function getRandomItemFromCache(menu: Menu, options?: RandomItemParams): RandomizedProduct {
  let category: Category;

  if (options?.categories && options?.categories?.length > 0) {
    const filteredCategories = menu.categories.filter((cat) => options.categories.includes(cat.title));
    console.log(filteredCategories);
    category = getRandom<Category>(filteredCategories);
    console.log(JSON.stringify(category));
  } else {
    category = getRandom<Category>(menu.categories);
  }
  
  if (!categoriesToSkip.includes(category.title.toLocaleLowerCase())) {
    const product = getRandom<Product>(category.products);
    const randomizedItem = randomizeItemContents(product, options);
    
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

async function getRandomItemFromScraper(options?: RandomItemParams): Promise<RandomizedProduct> {
  const categories = await scraper.getCategories();
  const category = getRandom<Category>(categories);

  if (!categoriesToSkip.includes(category.title.toLowerCase())) {
    const menuItems = await scraper.getMenuItems(category);
    const menuItem = getRandom<MenuItem>(menuItems);

    if (!categoriesToSkip.includes(menuItem.category)) {
      const productInfo = await scraper.getProductInfo(menuItem);
      const randomizedItem = await randomizeItemContents(productInfo, options);
      printResult(randomizedItem);
      return randomizedItem;
    } else {
      return getRandomItemFromScraper();
    }
  } else {
    return getRandomItemFromScraper();
  }
}

function randomizeItemContents(productInfo: Product, options?: RandomItemParams): RandomizedProduct {
  const randomizedProductInfo: RandomizedProduct = {
    title: productInfo.title,
    category: productInfo.category,
    includedItems: [],
    removedItems: [],
    addons: [],
    sauces: []
  };

  if (options?.allowItemRemoval) {
    productInfo.includedItems.forEach(ingredient => {
      const randomNumber = Math.random();
      if (randomNumber >= 0.15) {
        randomizedProductInfo.includedItems.push(ingredient);
      } else {
        randomizedProductInfo.removedItems.push(ingredient);
      }
    });
  } else {
    randomizedProductInfo.includedItems = Array.from(productInfo.includedItems);
  }

  productInfo.addons.forEach(addon => {
    const randomNumber = Math.random();
    if ((randomNumber <= 0.20 && !options?.excludeAddons.includes(addon)) ||
        options?.alwaysIncludeAddons.includes(addon)) {
      randomizedProductInfo.addons.push(addon);
    }
  });

  productInfo.sauces.forEach(sauce => {
    const maxNumberOfSauces = options?.maxNumberOfSauces ?? 2;
    const randomNumber = Math.random();

    if (options?.alwaysInclueSauces.includes(sauce)) {
      if (randomizedProductInfo.sauces.length >= maxNumberOfSauces) {
        const randomIndexToRemove = Math.floor(Math.random() * maxNumberOfSauces);
        randomizedProductInfo.sauces.splice(randomIndexToRemove, 1);
      }
      randomizedProductInfo.sauces.push(sauce);
    } else if (randomNumber <= 0.20
        && randomizedProductInfo.sauces.length < maxNumberOfSauces
        && !options?.excludeSauces.includes(sauce)) {
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
