import express, { Request } from 'express';
import { Logger } from '../services/logger.service';
import { CACHE_KEYS } from '../constants/cache-keys';
import { PossibleItems } from '../services/menu-helper.service';

const router = express.Router();

router.get('/full', async (req, res) => {
  try {
    Logger.info('Full menu requested', req.headers.host);
    return res.json({
      menuUpdateInProgress: !!req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU),
      ...req.cache.get(CACHE_KEYS.MENU)
    });
  } catch (e) {
    Logger.error(
      'error occured in GET /menu/full',
      req.headers.host,
      e
    );
  }
});

router.get('/categories', async (req, res) => {
  try {
    Logger.info('All categories requested', req.headers.host);
    return res.json({
      menuUpdateInProgress: !!req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU),
      categories: req.cache.get<PossibleItems>(CACHE_KEYS.MENU_POSSIBILITIES).categories
    });
  } catch (e) {
    Logger.error(
      'error occured in GET /menu/categories',
      req.headers.host,
      e
    );
  }
});

router.get('/addons', async (req, res) => {
  try {
    Logger.info('All addons requested', req.headers.host);
    return res.json({
      menuUpdateInProgress: !!req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU),
      addons: req.cache.get<PossibleItems>(CACHE_KEYS.MENU_POSSIBILITIES).addons
    });
  } catch (e) {
    Logger.error(
      'error occured in GET /menu/addons',
      req.headers.host,
      e
    );
  }
});

router.get('/sauces', async (req, res) => {
  try {
    Logger.info('All sauces requested', req.headers.host);
    return res.json({
      menuUpdateInProgress: !!req.cache.get(CACHE_KEYS.CURRENTLY_UPDATING_MENU),
      sauces: req.cache.get<PossibleItems>(CACHE_KEYS.MENU_POSSIBILITIES).sauces
    });
  } catch (e) {
    Logger.error(
      'error occured in GET /menu/sauces',
      req.headers.host,
      e
    );
  }
});

export default router;