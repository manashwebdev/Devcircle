import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { create, list, remove } from './controller';
import { commentIdParam, createCommentBody, postIdParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/post/:postId', validate({ params: postIdParam }), list);
router.post('/post/:postId', writeLimiter, validate({ params: postIdParam, body: createCommentBody }), create);
router.delete('/:id', writeLimiter, validate({ params: commentIdParam }), remove);
