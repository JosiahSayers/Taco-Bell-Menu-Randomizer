import express from 'express';
import { getRandomItem } from '../services/menu.service';
import { Product } from '../types/product.model';
import { CACHE_KEYS } from '../constants/cache-keys';
import { Menu } from '../types/menu';
import { updateCachedMenu } from '../services/cache.service';
import { RandomItemParams } from '../types/random-item-params.model';

const router = express.Router();

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.use((req, res, next) => {
  const menu = req.cache.get<Menu>(CACHE_KEYS.MENU);
  const currentlyUpdatingMenu = req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU);

  if (menu && menu.validUntil) {
    if (new Date() >= menu.validUntil) {
      if (currentlyUpdatingMenu) {
        console.log('Menu is already being updated, skipping update call');
      } else {
        console.log('Cached menu is out of date, fetching a new one...');
        updateCachedMenu(req.cache);
      }
    } else {
      console.log('Cache is still valid, skipping refresh');
    }
  } else {
    if (!currentlyUpdatingMenu) {
      console.log('Cached menu does not exist, grabbing it now...');
      updateCachedMenu(req.cache);
    } else {
      console.log('Menu is already being updated, skipping update call');
    }
  }
  next();
});

router.get('/single', async (req, res) => {
  let randomItem: Product;

  try {
    const params = new RandomItemParams({});
    randomItem = await getRandomItem(req.cache.get(CACHE_KEYS.MENU), params);
    res.json(randomItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unknown error' });
  }
});

router.post('/single', async (req, res) => {
  let randomItem: Product;

  try {
    const params = new RandomItemParams(req.body);
    randomItem = await getRandomItem(req.cache.get(CACHE_KEYS.MENU), params);
    res.json(randomItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unknown error' });
  }
});

export default router;