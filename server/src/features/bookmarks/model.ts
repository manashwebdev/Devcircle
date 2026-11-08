import { Schema, model } from 'mongoose';

const bookmarkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, createdAt: -1 }); // the Saved page

export const Bookmark = model('Bookmark', bookmarkSchema);
