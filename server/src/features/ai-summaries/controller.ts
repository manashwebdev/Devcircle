import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { aiEnabled, summarisePost } from './service';

export const status = asyncHandler(async (_req, res) => ok(res, { enabled: aiEnabled() }));
export const summarise = asyncHandler(async (req, res) => ok(res, await summarisePost(req.params.postId as string)));
