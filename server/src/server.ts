import { env } from './core/env';
import { connectDb } from './core/db';
import { createApp } from './app';

async function main() {
  await connectDb();
  const { app } = await createApp();
  app.listen(env.PORT, () => console.log(`[server] http://localhost:${env.PORT} (${env.NODE_ENV})`));
}

main().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});
