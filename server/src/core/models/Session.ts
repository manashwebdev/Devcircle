import { Schema, model } from 'mongoose';

/**
 * One document per signed-in browser. The JWT carries the session id (sid),
 * so logging out (deleting this document) kills the token immediately.
 */
const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userAgent: { type: String, maxlength: 300, default: '' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB deletes each document automatically once its expiresAt date has passed.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model('Session', sessionSchema);
