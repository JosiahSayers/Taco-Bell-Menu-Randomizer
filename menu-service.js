const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');

const baseUrl = 'https://tacobell.com';
const startingUrl = baseUrl + '/food';

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

async function getRandomItem() {
  const category = await getItemCategory();

  if (!categoriesToSkip.includes(category.title.toLowerCase())) {
    const menuItem = await getMenuItem(category);

    if (!categoriesToSkip.includes(menuItem.category)) {
      const productInfo = await getProductInfo(menuItem);
      const randomizedItem = await randomizeItemContents(productInfo);
      printResult(randomizedItem);
      return randomizedItem;
    } else {
      console.log('Category does not allow customizations! Looking again...');
      return getRandomItem();
    }
  } else {
    console.log('Category does not allow customizations! Looking again...');
    return getRandomItem();
  }
}

async function getItemCategory() {
  console.log('ENTERING getItemCategory');
  const response = await axios(startingUrl);
  console.log('getItemCategory response: ', JSON.stringify(response));

  const html = response.data;
  const $ = cheerio.load(html);
  const menuItems = $('a.cls-category-card-item').toArray();
  const titleItems = $('a.cls-category-card-item > .cls-category-card-item-card > .text > span');
  const itemInformation = [];
  
  menuItems.forEach((item, index) => {
    const href = baseUrl + item.attribs.href;
    const title = titleItems[index].children[0].data;
    itemInformation.push({ href, title });
  });

  return getRandom(itemInformation);
}

async function getMenuItem(categoryObject) {
  const response = await axios(categoryObject.href);

  const html = response.data;
  const $ = cheerio.load(html);
  const productDetailsArray = $('div.product-details > .product-name > a').toArray();
  const products = [];
  
  productDetailsArray.forEach(product => {
    const category = product.attribs.href.split('/')[2];
    const href = baseUrl + product.attribs.href;
    const title = product.children[0].data;
    products.push({ href, title, category });
  });

  return getRandom(products);
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

async function randomizeItemContents(productInfo) {
  const randomizedProductInfo = {
    title: productInfo.title,
    category: productInfo.category,
    includedItems: [],
    removedItems: [],
    addons: [],
    sauces: []
  };

  productInfo.includedByDefault.forEach(ingredient => {
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

function getRandom(array) {
  if (Array.isArray(array)) {
    return array[Math.floor(Math.random() * array.length)];
  }
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

function printResult(item) {
  console.log(chalk.blue.underline.bold(`\n${item.title}\n`));
  printArray(item.removedItems, chalk.red, '-');
  printArray(item.addons, chalk.green, '+');
  printArray(item.sauces, chalk.green, '+');
  console.log('\n');
}

function printArray(arr, chalk, append = '') {
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      console.log(chalk(append + item));
    });
  }
}

module.exports = getRandomItem;