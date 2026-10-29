import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { echoController } from './controller';
import { echoBody } from './schema';

export const router = Router();
router.post('/echo', requireAuth, writeLimiter, validate({ body: echoBody }), echoController);
