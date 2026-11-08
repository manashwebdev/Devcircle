import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { list, state, toggle } from './controller';
import { postIdParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/', list);
router.get('/post/:postId', validate({ params: postIdParam }), state);
router.post('/post/:postId', writeLimiter, validate({ params: postIdParam }), toggle);
