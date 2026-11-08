import { Schema, model } from 'mongoose';

/** One cached TL;DR per post. bodyHash changes when the post is edited, which invalidates the cache. */
const summarySchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true, unique: true },
    bodyHash: { type: String, required: true },
    bullets: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Summary = model('Summary', summarySchema);
