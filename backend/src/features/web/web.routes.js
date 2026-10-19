import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';

const HASHED_ASSETS = `${path.sep}_next${path.sep}static${path.sep}`;

function isWebBuilt(publicDir) {
  return fs.existsSync(path.join(publicDir, 'index.html'));
}

function setCacheHeaders(res, filePath) {
  const cache = filePath.includes(HASHED_ASSETS) ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.setHeader('Cache-Control', cache);
}

function createWebRoutes(publicDir) {
  const notFoundPage = path.join(publicDir, '404.html');
  const router = Router();

  router.use(express.static(publicDir, { extensions: ['html'], setHeaders: setCacheHeaders }));
  router.use((req, res) => {
    if (!fs.existsSync(notFoundPage)) {
      res.status(404).type('text').send('Not found');
      return;
    }
    res.status(404).sendFile(notFoundPage);
  });

  return router;
}

export { createWebRoutes, isWebBuilt };
