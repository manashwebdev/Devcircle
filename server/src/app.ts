import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './core/env';
import { csrfGuard } from './core/csrf';
import { errorHandler, notFoundHandler } from './core/errors';
import { globalLimiter } from './core/rateLimit';
import { ok } from './core/response';
import { authRouter } from './core/auth/routes';
import { loadFeatures } from './core/registry';

/**
 * Builds the Express app.
 * Core routes are always mounted; feature routers are mounted only if their flag is on
 * (see core/registry.ts), each under /api/<feature-id>.
 */
export async function createApp() {
  const app = express();

  // Render / Vercel put a proxy in front of us: needed for correct client IPs (rate limits) and secure cookies.
  app.set('trust proxy', 1);

  app.use(helmet());
  // CORS is locked to ONE origin: the client. credentials:true lets the browser send the session cookie.
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-Requested-With'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use('/api', globalLimiter, csrfGuard);

  const modules = await loadFeatures();

  app.get('/api/health', (_req, res) => ok(res, { status: 'up' }));
  // The client calls this on load so disabled features vanish from nav and routes.
  app.get('/api/features', (_req, res) => ok(res, { enabled: modules.map((m) => m.manifest.id) }));

  app.use('/api/auth', authRouter);
  for (const m of modules) {
    app.use(`/api/${m.manifest.id}`, m.router);
    console.log(`[features] mounted /api/${m.manifest.id}`);
  }

  app.use('/api', notFoundHandler);
  app.use(errorHandler);
  return { app, modules };
}
