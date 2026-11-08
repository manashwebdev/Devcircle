/** npm run make-admin -- <username>   (add --remove to take the role away) */
import mongoose from 'mongoose';
import { connectDb } from '../src/core/db';
import { User } from '../src/core/models/User';

async function main() {
  const username = process.argv[2]?.toLowerCase();
  if (!username || username.startsWith('--')) throw new Error('Usage: npm run make-admin -- <username> [--remove]');
  await connectDb();
  const role = process.argv.includes('--remove') ? 'user' : 'admin';
  const res = await User.updateOne({ username }, { $set: { role } });
  if (res.matchedCount === 0) throw new Error(`No user "${username}". Sign in once first so the account exists.`);
  console.log(`${username} is now: ${role}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
