import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';
import { config } from '../../config/env.js';

const INDEX_PAGE = path.join(config.publicDir, 'index.html');
const NOT_FOUND_PAGE = path.join(config.publicDir, '404.html');
const HASHED_ASSETS = `${path.sep}_next${path.sep}static${path.sep}`;

function isWebBuilt() {
  return fs.existsSync(INDEX_PAGE);
}

function setCacheHeaders(res, filePath) {
  const cache = filePath.includes(HASHED_ASSETS) ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.setHeader('Cache-Control', cache);
}

function sendNotFound(req, res) {
  if (!fs.existsSync(NOT_FOUND_PAGE)) {
    res.status(404).type('text').send('Not found');
    return;
  }
  res.status(404).sendFile(NOT_FOUND_PAGE);
}

const router = Router();

router.use(express.static(config.publicDir, { extensions: ['html'], setHeaders: setCacheHeaders }));
router.use(sendNotFound);

export default router;
export { isWebBuilt };
