import { Schema, model } from 'mongoose';

// The size rules live here so every file uses the same numbers.
export const MIN_MEMBERS = 5; // below this the circle is "forming"
export const MAX_MEMBERS = 8; // hard cap

const circleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 40 },
    description: { type: String, trim: true, maxlength: 200, default: '' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // private = members only. public = any signed-in developer can view it (read-only).
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },

    // Members in the order they joined (the first one is the longest-standing).
    members: {
      type: [
        {
          _id: false,
          userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          joinedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // People the owner removed. They cannot rejoin through the invite link.
    kicked: { type: [Schema.Types.ObjectId], default: [] },

    // Random, URL-safe code. The invite link is {CLIENT_URL}/circles/join/{inviteCode}.
    inviteCode: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

// "Which circles am I in?" is the main list query.
circleSchema.index({ 'members.userId': 1, createdAt: -1 });
// "Browse public circles" query.
circleSchema.index({ visibility: 1, createdAt: -1 });

export const Circle = model('Circle', circleSchema);