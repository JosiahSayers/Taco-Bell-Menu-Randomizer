const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');

const baseUrl = 'https://tacobell.com';
const startingUrl = baseUrl + '/food';

async function getCategories() {
  const response = await axios(startingUrl);

  const html = response.data;
  const $ = cheerio.load(html);
  const menuItems = $('a.cls-category-card-item').toArray();
  const titleItems = $('a.cls-category-card-item > .cls-category-card-item-card > .text > span');
  const categories = [];
  
  menuItems.forEach((item, index) => {
    const href = baseUrl + item.attribs.href;
    const title = titleItems[index].children[0].data;
    categories.push({ href, title });
  });

  return categories;
}

async function getMenuItems(categoryObject) {
  const response = await axios(categoryObject.href);

  const html = response.data;
  const $ = cheerio.load(html);
  const productDetailsArray = $('div.product-details > .product-name > a').toArray();
  const menuItems = [];
  
  productDetailsArray.forEach(product => {
    const category = product.attribs.href.split('/')[2];
    const href = baseUrl + product.attribs.href;
    const title = product.children[0].data;
    menuItems.push({ href, title, category });
  });

  return menuItems;
}

async function getProductInfo(menuItem) {
  const response = await axios(menuItem.href);
  const html = response.data;
  const $ = cheerio.load(html);
  const productInfo = {
    title: menuItem.title,
    category: menuItem.category,
    includedByDefault: [],
    addons: [],
    sauces: []
  };

  const includedArray = $('li.included-per-default > div > div > span').toArray();
  const addonsArray = $('[data-group=addons] > ul > li > div.custom-info > span').toArray();
  const saucesArray = $('[data-group=sauces] > ul > li > div.custom-info > span').toArray();

  includedArray.forEach(item => productInfo.includedByDefault.push(item.children[0].data));
  addonsArray.forEach(addon => productInfo.addons.push(addon.children[0].data));
  saucesArray.forEach(sauce => productInfo.sauces.push(sauce.children[0].data));

  Object.keys(productInfo).forEach(key => productInfo[key] = removeEmptyStringsFromArray(productInfo[key]));

  return productInfo;
}

function removeEmptyStringsFromArray(array) {
  if (Array.isArray(array)) {
    const outputArray = [];

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

module.exports = {
  getCategories,
  getMenuItems,
  getProductInfo
};