/**
 * Demo data: npm run seed
 * Runs the seed() of every ENABLED feature, so turning a module off also skips its demo data.
 * Refuses to run against production unless you pass --force.
 */
import mongoose from 'mongoose';
import { env, isProd } from '../src/core/env';
import { connectDb } from '../src/core/db';
import { loadFeatures } from '../src/core/registry';

async function main() {
  if (isProd && !process.argv.includes('--force')) {
    throw new Error('Refusing to seed production. Pass --force if you really mean it.');
  }
  await connectDb();
  for (const m of await loadFeatures()) {
    if (m.seed) await m.seed();
  }
  console.log(`Seed complete on ${env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
