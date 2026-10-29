import { Schema, model } from 'mongoose';

/**
 * Example model. Rename it, add fields and indexes (feed-style queries need createdAt / tags / circleId indexes).
 * Only import this file from this feature's service.ts so the model is loaded only when the feature is on.
 */
const exampleSchema = new Schema({ text: { type: String, required: true, maxlength: 200 } }, { timestamps: true });
exampleSchema.index({ createdAt: -1 });

export const Example = model('TemplateExample', exampleSchema);
