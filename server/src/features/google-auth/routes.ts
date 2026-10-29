import { Router } from 'express';
import { authLimiter } from '../../core/rateLimit';
import { callback, start } from './controller';

export const router = Router();
router.get('/start', authLimiter, start);
router.get('/callback', authLimiter, callback);