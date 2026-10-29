import { Schema, model } from 'mongoose';

export const POST_TYPES = ['built', 'broke', 'learned'] as const;
export const POST_REQUESTS = ['none', 'try', 'review'] as const;

/**
 * A post. Only the posts feature loads this file, so with the module off the collection is never touched.
 * Hidden posts (admin moderation, later) stay in the database but are filtered out of every query.
 */
const postSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: POST_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, maxlength: 10000 }, // raw markdown; it is sanitised when rendered
    excerpt: { type: String, default: '', maxlength: 240 }, // plain-text preview so feed queries can skip `body`
    tags: { type: [String], default: [] },
    link: { type: String, maxlength: 300 }, // optional repo / demo URL
    request: { type: String, enum: POST_REQUESTS, default: 'none' }, // "Try it" / "Review it" flag
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes for the queries the feed actually runs.
postSchema.index({ hidden: 1, createdAt: -1 }); // main feed
postSchema.index({ hidden: 1, type: 1, createdAt: -1 }); // feed filtered by type
postSchema.index({ tags: 1, createdAt: -1 }); // feed filtered by tag (also used by explore)
postSchema.index({ authorId: 1, createdAt: -1 }); // one person's posts
postSchema.index({ request: 1, createdAt: -1 }); // "Try it" / "Review it" requests (explore)

export const Post = model('Post', postSchema);
