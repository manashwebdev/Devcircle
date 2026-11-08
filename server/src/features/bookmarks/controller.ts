import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { isSaved, listSaved, toggleSaved } from './service';

export const list = asyncHandler(async (req, res) => {
  ok(res, await listSaved(req.auth!.user.id));
});
export const state = asyncHandler(async (req, res) => {
  ok(res, await isSaved(req.auth!.user.id, req.params.postId as string));
});
export const toggle = asyncHandler(async (req, res) => {
  ok(res, await toggleSaved(req.auth!.user.id, req.params.postId as string));
});
