import { Schema, model } from 'mongoose';

// One row per person per day they checked in anywhere. Feeds the personal heatmap.
const activitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
});
activitySchema.index({ userId: 1, day: 1 }, { unique: true });
export const ActivityDay = model('ActivityDay', activitySchema);

// The running circle streak: one row per circle.
const circleStreakSchema = new Schema(
  {
    circleId: { type: Schema.Types.ObjectId, required: true, unique: true },
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastDay: { type: String, default: '' },
  },
  { timestamps: true },
);
export const CircleStreak = model('CircleStreak', circleStreakSchema);

// One row per circle per day when EVERYONE checked in. Feeds the circle heatmap.
const circleDaySchema = new Schema({
  circleId: { type: Schema.Types.ObjectId, required: true },
  day: { type: String, required: true },
});
circleDaySchema.index({ circleId: 1, day: 1 }, { unique: true });
export const CircleDay = model('CircleDay', circleDaySchema);