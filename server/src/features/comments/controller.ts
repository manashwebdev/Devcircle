import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { createComment, deleteComment, listComments } from './service';
import type { CreateCommentInput } from './schema';

export const list = asyncHandler(async (req, res) => {
  ok(res, await listComments(req.auth!.user, req.params.postId as string));
});
export const create = asyncHandler(async (req, res) => {
  ok(res, await createComment(req.auth!.user, req.params.postId as string, req.body as CreateCommentInput), 201);
});
export const remove = asyncHandler(async (req, res) => {
  ok(res, await deleteComment(req.auth!.user, req.params.id as string));
});
