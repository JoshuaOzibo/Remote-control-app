import { Router } from 'express';
import { config } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv, uptime: process.uptime() });
});

export default router;
