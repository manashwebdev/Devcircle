import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { count, list, readAll, readOne } from './controller';
import { notificationIdParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/', list);
router.get('/unread-count', count);
router.post('/read-all', writeLimiter, readAll);
router.post('/:id/read', writeLimiter, validate({ params: notificationIdParam }), readOne);
