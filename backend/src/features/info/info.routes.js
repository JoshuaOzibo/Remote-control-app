import os from 'os';
import { Router } from 'express';

function createInfoRoutes({ version }) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({ name: os.hostname(), version });
  });

  return router;
}

export { createInfoRoutes };
