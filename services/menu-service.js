const scraper = require('./scraper-service');
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
  const categories = await scraper.getCategories();
  const category = getRandom(categories);

  if (!categoriesToSkip.includes(category.title.toLowerCase())) {
    const menuItems = await scraper.getMenuItems(category);
    const menuItem = getRandom(menuItems);

    if (!categoriesToSkip.includes(menuItem.category)) {
      const productInfo = await scraper.getProductInfo(menuItem);
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