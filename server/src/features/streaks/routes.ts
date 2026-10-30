import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { validate } from '../../core/validate';
import { forCircle, forUser } from './controller';
import { circleIdParam, usernameParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/users/:username', validate({ params: usernameParam }), forUser);
router.get('/circles/:id', validate({ params: circleIdParam }), forCircle);