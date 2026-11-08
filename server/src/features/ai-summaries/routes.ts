import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { aiLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { status, summarise } from './controller';
import { postIdParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/status', status);
router.post('/post/:postId', aiLimiter, validate({ params: postIdParam }), summarise);
