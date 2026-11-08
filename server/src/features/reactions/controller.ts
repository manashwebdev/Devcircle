import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { getReactions, toggleReaction } from './service';
import type { ToggleInput } from './schema';

export const get = asyncHandler(async (req, res) => {
  ok(res, await getReactions(req.params.postId as string, req.auth!.user.id));
});
export const toggle = asyncHandler(async (req, res) => {
  ok(res, await toggleReaction(req.auth!.user, req.params.postId as string, (req.body as ToggleInput).kind));
});
