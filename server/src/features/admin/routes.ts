import { Router } from 'express';
import { requireAuth, requireRole } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { ban, getStats, hide, posts, users } from './controller';
import { banBody, hiddenBody, idParam, usersQuery } from './schema';

export const router = Router();
// Every admin route needs a session AND the admin role, checked on the server (the client only hides the nav item).
router.use(requireAuth, requireRole('admin'));
router.get('/stats', getStats);
router.get('/users', validate({ query: usersQuery }), users);
router.post('/users/:id/ban', writeLimiter, validate({ params: idParam, body: banBody }), ban);
router.get('/posts', posts);
router.post('/posts/:id/hidden', writeLimiter, validate({ params: idParam, body: hiddenBody }), hide);
