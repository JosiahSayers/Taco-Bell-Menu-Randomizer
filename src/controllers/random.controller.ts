import express, { Request } from 'express';
import { getRandomItem } from '../services/menu.service';
import { Product } from '../types/product.model';
import { CACHE_KEYS } from '../constants/cache-keys';
import { Menu } from '../types/menu';
import { updateCachedMenu } from '../services/cache.service';
import { RandomItemParams } from '../types/random-item-params.model';
import { Logger } from '../services/logger.service';

const router = express.Router();

router.use(function timeLog(req: Request, res, next) {
  Logger.info(
    'Random item request',
    {
      method: req.method,
      ip: req.ip,
      body: req.body
    }
  );
  next();
});

router.use((req, res, next) => {
  const menu = req.cache.get<Menu>(CACHE_KEYS.MENU);
  const currentlyUpdatingMenu = req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU);

  if (menu && menu.validUntil) {
    if (new Date() >= new Date(menu.validUntil)) {
      console.log('OUT OF DATE');
      if (!currentlyUpdatingMenu) {
        console.log('UPDATING')
        updateCachedMenu(req.cache);
      }
    }
  } else {
    if (!currentlyUpdatingMenu) {
      updateCachedMenu(req.cache);
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
    Logger.error(
      'error occured in GET /single',
      error
    );
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
    Logger.error(
      'error occured in POST /single',
      error
    );
    res.status(500).json({ error: 'unknown error' });
  }
});

export default router;