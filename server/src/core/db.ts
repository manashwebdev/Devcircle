import mongoose from 'mongoose';
import { env } from './env';

/** Connect once at boot. Models are registered when their files are imported. */
export async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  console.log('[db] connected');
}
