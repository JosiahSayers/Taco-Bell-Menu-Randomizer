import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import NodeCache from 'node-cache';

import randomRouter from './controllers/random.controller';

const app = express();
const port = process.env.PORT;
const _cache = new NodeCache();

const injectCache = (req: Express.Request, res: Express.Response, next: Function) => {
  req.cache = _cache;
  next();
}

app.use(injectCache);
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/random', randomRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))