import * as scraper from './scraper.service';
import { Product } from '../types/product.model';
import { RandomizedProduct } from '../types/randomized-product.model';
import { Category } from '../types/category.model';
import { MenuItem } from '../types/menu-item.model';
import { Menu } from '../types/menu';
import { RandomItemParams } from '../types/random-item-params.model';
import { Logger } from './logger.service';
import { asyncForEach, includesCaseInsensitve } from './helper-functions.server';

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
            Logger.error(`Error fetching product (${menuItem.title}) during menu update`, undefined, e);
            return null;
          }
        });

        return null;

      } catch (e) {
        Logger.error(`Error fetching category (${category.title}) during menu update`, undefined, e);
        return null;
      }

    });
  } catch (e) {
    Logger.error('Error fetching Menu!', undefined, e);
  }

  return menu;
}

export async function getRandomItem(menu: Menu, options?: RandomItemParams): Promise<RandomizedProduct> {
  if (menu) {
    return getRandomItemFromCache(menu, options);
  } else {
    return getRandomItemFromScraper(options);
  }
}

function getRandomItemFromCache(menu: Menu, options?: RandomItemParams): RandomizedProduct {
  let category: Category;

  if (options?.categories?.length > 0) {
    const filteredCategories = menu.categories.filter((cat) => includesCaseInsensitve(options.categories, cat.title));
    category = getRandom<Category>(filteredCategories);
  } else {
    category = getRandom<Category>(menu.categories);
  }

  if (!includesCaseInsensitve(categoriesToSkip, category.title)) {
    const product = getRandom<Product>(category.products);
    const randomizedItem = randomizeItemContents(product, options);

    if (!includesCaseInsensitve(categoriesToSkip, randomizedItem.category)) {
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

  if (!includesCaseInsensitve(categoriesToSkip, category.title)) {
    const menuItems = await scraper.getMenuItems(category);
    const menuItem = getRandom<MenuItem>(menuItems);

    if (!includesCaseInsensitve(categoriesToSkip, menuItem.category)) {
      const productInfo = await scraper.getProductInfo(menuItem);
      const randomizedItem = await randomizeItemContents(productInfo, options);
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
    let shouldPushAddon = false;

    if (options?.alwaysIncludeAddons.length > 0) {
      shouldPushAddon = includesCaseInsensitve(options?.alwaysIncludeAddons, addon) && randomNumber <= 0.20;
    } else {
      shouldPushAddon = randomNumber <= 0.20;
    }

    if (shouldPushAddon) {
      randomizedProductInfo.addons.push(addon);
    }
  });

  productInfo.sauces.forEach(sauce => {
    const maxNumberOfSauces = options?.maxNumberOfSauces ?? 2;
    const randomNumber = Math.random();
    let shouldPushAddon = false;

    if (randomizedProductInfo.sauces.length < maxNumberOfSauces) {
      if (options?.alwaysIncludeSauces.length > 0) {
        shouldPushAddon = includesCaseInsensitve(options?.alwaysIncludeSauces, sauce) && randomNumber <= 0.20;
      } else {
        shouldPushAddon = randomNumber <= 0.20;
      }
    }

    if (shouldPushAddon) {
      randomizedProductInfo.sauces.push(sauce);
    }
  });

  return randomizedProductInfo;
}

function getRandom<T>(array: any[]): T {
  if (Array.isArray(array)) {
    return array[Math.floor(Math.random() * array.length)];
  } else {
    return array;
  }
}

