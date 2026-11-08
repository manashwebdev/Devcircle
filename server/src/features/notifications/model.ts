import { Schema, model } from 'mongoose';

export const NOTIFICATION_KINDS = ['comment', 'reply', 'mention', 'reaction', 'follow'] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // who receives it
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // who did it
    kind: { type: String, enum: NOTIFICATION_KINDS, required: true },
    postId: { type: Schema.Types.ObjectId }, // not set for "follow"
    postTitle: { type: String, default: '', maxlength: 120 }, // snapshot, so we never need the posts model
    snippet: { type: String, default: '', maxlength: 120 },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
// Old notifications clean themselves up after 60 days.
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

export const Notification = model('Notification', notificationSchema);
