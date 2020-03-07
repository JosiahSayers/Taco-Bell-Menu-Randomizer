import NodeCache = require("node-cache");
import { CACHE_KEYS } from "../constants/cache-keys";
import { getMenu } from "./menu.service";

export async function updateCachedMenu(cache: NodeCache) {
  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, true);

  cache.set(CACHE_KEYS.MENU, await getMenu());

  console.log('MENU UPDATE COMPLETE!');
  cache.set(CACHE_KEYS.CURRENTLY_UPDATING_MENU, false);
  cache.set(CACHE_KEYS.IS_CACHED_MENU_VALID, true);
}