import NodeCache = require('node-cache');

declare global {
  namespace Express {
    export interface Request {
       cache: NodeCache
    }
  }
}