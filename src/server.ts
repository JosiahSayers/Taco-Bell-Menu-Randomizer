import express, { Request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import randomRouter from './controllers/random.controller';
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
getAllPossibleValues(_cache.get(CACHE_KEYS.MENU));

const injectCache = (req: Express.Request, res: Express.Response, next: Function) => {
  req.cache = _cache;
  next();
}

mongoose.connect(MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(injectCache);
app.use(cors());
app.use((req: Request, res, next) => {
  if (req.path === '/' && req.method === 'GET') {
    Logger.info(
      'Web app was requested',
      {
        baseUrl: req.baseUrl,
        path: req.path,
        url: req.url,
        originalUrl: req.originalUrl,
        ip: req.ip,
        method: req.method,
        hostname: req.hostname
      }
    );
  }
  next();
});
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/random', randomRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));