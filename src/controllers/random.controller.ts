import express from 'express';
import { getRandomItem } from '../services/menu.service';
import { Product } from '../types/product.model';
import { CACHE_KEYS } from '../constants/cache-keys';
import { Menu } from '../types/menu';

const router = express.Router();

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.use((req, res, next) => {
  const menu = req.cache.get<Menu>(CACHE_KEYS.MENU);
  if (menu && menu.validUntil) {
    if (new Date() >= menu.validUntil) {
      
    }
  }
  next();
});

router.get('/single', async (req, res) => {
  let randomItem: Product;

  try {
    randomItem = await getRandomItem();
    res.json(randomItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unknown error' });
  }
});

export default router;