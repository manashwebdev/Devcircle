import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { get, toggle } from './controller';
import { postIdParam, toggleBody } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/post/:postId', validate({ params: postIdParam }), get);
router.post('/post/:postId', writeLimiter, validate({ params: postIdParam, body: toggleBody }), toggle);
