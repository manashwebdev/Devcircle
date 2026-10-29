import { Router } from 'express';
import { authLimiter } from '../rateLimit';
import { requireAuth } from '../authMiddleware';
import { githubCallback, githubStart, logout, me } from './controller';

/** Mounted at /api/auth. Always on. (The google-auth module adds its own routes next to these.) */
export const authRouter = Router();
authRouter.get('/github', authLimiter, githubStart);
authRouter.get('/github/callback', authLimiter, githubCallback);
authRouter.get('/me', requireAuth, me);
authRouter.post('/logout', requireAuth, logout);
