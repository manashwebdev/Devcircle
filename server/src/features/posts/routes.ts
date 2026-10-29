import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { create, getOne, list, remove } from './controller';
import { createPostBody, listPostsQuery, postIdParam } from './schema';

export const router = Router();
// DevCircle is developers-only, so even reading needs a session.
router.use(requireAuth);
router.get('/', validate({ query: listPostsQuery }), list);
router.post('/', writeLimiter, validate({ body: createPostBody }), create);
router.get('/:id', validate({ params: postIdParam }), getOne);
router.delete('/:id', writeLimiter, validate({ params: postIdParam }), remove);
