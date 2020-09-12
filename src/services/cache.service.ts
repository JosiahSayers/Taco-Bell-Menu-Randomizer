import NodeCache = require("node-cache");
import { CACHE_KEYS } from "../constants/cache-keys";
import { getMenu } from "./menu.service";
import { Menu } from "../types/menu";
import fs from 'fs';
import { getAllPossibleValues } from './menu-helper.service';
import { Logger } from './logger.service';

const menuFilepath = './cache.json';

export async function updateCachedMenu(cache: NodeCache) {
  Logger.startTimerFor('MENU UPDATE');
  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, true);

  const menu = await getMenu();

  cache.set(CACHE_KEYS.MENU, menu);
  writeMenuToDisk(menu);
  getAllPossibleValues(menu, true);

  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, false);
  cache.set(CACHE_KEYS.IS_CACHED_MENU_VALID, true);
  Logger.finishTimerFor('MENU UPDATE');
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
    return null;
  }
}