import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { feed, people, state, toggle } from './controller';
import { feedQuery, usernameParam } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/people', people);
router.get('/feed', validate({ query: feedQuery }), feed);
router.get('/user/:username', validate({ params: usernameParam }), state);
router.post('/user/:username', writeLimiter, validate({ params: usernameParam }), toggle);
