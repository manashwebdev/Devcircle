import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { get } from './controller';

export const router = Router();
router.use(requireAuth);
router.get('/', get);
