import NodeCache = require("node-cache");
import { CACHE_KEYS } from "../constants/cache-keys";
import { getMenu } from "./menu.service";
import { Menu } from "../types/menu";
import fs from 'fs';

const menuFilepath = './cache.json';

export async function updateCachedMenu(cache: NodeCache) {
  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, true);

  const menu = await getMenu();

  cache.set(CACHE_KEYS.MENU, menu);
  writeMenuToDisk(menu);

  console.log('MENU UPDATE COMPLETE!');
  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, false);
  cache.set(CACHE_KEYS.IS_CACHED_MENU_VALID, true);
}

function writeMenuToDisk(menu: Menu) {
  fs.writeFileSync(menuFilepath, JSON.stringify(menu), { encoding: 'utf8' });
}

export function getValidMenuFromDisk(): Menu {
  try {
    const menuString = fs.readFileSync(menuFilepath, { encoding: 'utf8' });
    const menu: Menu = JSON.parse(menuString);
    return menu;
  } catch (e) {
    console.log('Menu not found on disk');
    return null;
  }
}