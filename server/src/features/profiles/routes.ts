import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { getOne, updateMe } from './controller';
import { updateProfileBody, usernameParam } from './schema';

export const router = Router();
// Declared first so "me" is never mistaken for a username.
router.patch('/me', requireAuth, writeLimiter, validate({ body: updateProfileBody }), updateMe);
router.get('/:username', validate({ params: usernameParam }), getOne);
