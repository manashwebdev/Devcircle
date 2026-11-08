import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { validate } from '../../core/validate';
import { run } from './controller';
import { searchQuery } from './schema';

export const router = Router();
router.use(requireAuth);
router.get('/', validate({ query: searchQuery }), run);
