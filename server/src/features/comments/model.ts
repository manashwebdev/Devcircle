import { Schema, model } from 'mongoose';

/**
 * A comment on a post. Replies are ONE level deep: a reply's parentId always points at a top-level comment.
 * postId is a plain ObjectId (no ref) because the posts feature may be off; see core/lookup.ts.
 */
const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, default: null },
    body: { type: String, required: true, maxlength: 1500 }, // raw markdown, rendered safely on the client
  },
  { timestamps: true },
);

commentSchema.index({ postId: 1, createdAt: 1 }); // the thread under one post
commentSchema.index({ parentId: 1 }); // delete a comment together with its replies

export const Comment = model('Comment', commentSchema);
