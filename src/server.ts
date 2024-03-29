import express, { Request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import randomRouter from './controllers/random.controller';
import menuRouter from './controllers/menu.controller';
import { CACHE_KEYS } from './constants/cache-keys';
import { getValidMenuFromDisk } from './services/cache.service';
import { getAllPossibleValues } from './services/menu-helper.service';
import { Logger } from './services/logger.service';

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const _cache = new NodeCache();
_cache.set(CACHE_KEYS.MENU, getValidMenuFromDisk());
_cache.set(CACHE_KEYS.MENU_POSSIBILITIES, getAllPossibleValues(_cache.get(CACHE_KEYS.MENU)));

const injectCache = (req: Express.Request, res: Express.Response, next: Function) => {
  req.cache = _cache;
  next();
}

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
}

app.use(injectCache);
app.use(cors());
app.use((req: Request, res, next) => {
  if (req.path === '/' && req.method === 'GET') {
    Logger.info(
      'Web app was requested',
      req.headers.host,
      {
        ip: req.ip
      }
    );
  }
  next();
});
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/random', randomRouter);
app.use('/menu', menuRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));