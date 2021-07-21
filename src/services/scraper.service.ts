import axios from 'axios';
import cheerio from 'cheerio';
import { IGNORED_CATEGORIES } from '../constants/menu-filter';

import { Category } from "../types/category.model";
import { MenuItem } from '../types/menu-item.model';
import { Product } from '../types/product.model';
import { includesCaseInsensitve, stringCompare } from './helper-functions.server';
import { Logger } from './logger.service';

const baseUrl = 'https://tacobell.com';
const startingUrl = baseUrl + '/food';

export async function getCategories(): Promise<Category[]> {
  const response = await axios(startingUrl);

  const html = response.data;
  const $ = cheerio.load(html);
  const menuItems = $('[class*="menu-tile"] [class*="content"] a').toArray() || [];
  const titleItems = $('[class*="menu-tile"] [class*="content"] a span[class*="label"]');
  const categories: Category[] = [];
  
  menuItems.forEach((item, index) => {
    const href = baseUrl + item.attribs.href;
    const title = titleItems[index].children[0].data;
    if (!includesCaseInsensitve(IGNORED_CATEGORIES, title)) {
      categories.push({ href, title });
    }
  });

  return categories;
}

export async function getMenuItems(categoryObject: Category): Promise<MenuItem[]> {
  const response = await axios(categoryObject.href);

  const html = response.data;
  const $ = cheerio.load(html);
  const productDetailsArray = $('div.product-details > .product-name > a').toArray();
  const menuItems: MenuItem[] = [];
  
  productDetailsArray.forEach(product => {
    const category = product.attribs.href.split('/')[2];
    const href = baseUrl + product.attribs.href;
    const title = product.children[0].data;

    if (!includesCaseInsensitve(IGNORED_CATEGORIES, category)) {
      menuItems.push({ href, title, category });
    }
  });

  return menuItems;
}

export async function getProductInfo(menuItem: MenuItem): Promise<Product> {
  const response = await axios(menuItem.href);
  const html = response.data;
  const $ = cheerio.load(html);
  const productInfo: Product = {
    title: menuItem.title,
    category: menuItem.category,
    includedItems: [],
    addons: [],
    sauces: []
  };

  const includedArray = $('li.included-per-default > div > div > span').toArray();
  const addonsArray = $('[data-group=addons] > ul > li > div.custom-info > span').toArray();
  const saucesArray = $('[data-group=sauces] > ul > li > div.custom-info > span').toArray();

  includedArray.forEach(item => productInfo.includedItems.push(item.children[0].data));
  addonsArray.forEach(addon => productInfo.addons.push(addon.children[0].data));
  saucesArray.forEach(sauce => productInfo.sauces.push(sauce.children[0].data));

  productInfo.includedItems = removeEmptyStringsFromArray(productInfo.includedItems);
  productInfo.addons = removeEmptyStringsFromArray(productInfo.addons);
  productInfo.sauces = removeEmptyStringsFromArray(productInfo.sauces);

  return productInfo;
}

function removeEmptyStringsFromArray(array: string[]) {
  if (Array.isArray(array)) {
    const outputArray: string[] = [];

    array.forEach(string => {
      if (string.trim().length > 0) {
        outputArray.push(string);
      }
    });

    return outputArray;
  } else {
    return array;
  }
}