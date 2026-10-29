import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { createPost, deletePost, getPost, listPosts } from './service';
import type { CreatePostInput, ListPostsQuery } from './schema';

// Thin controllers: read the request, call the service, send the reply.
export const list = asyncHandler(async (req, res) => {
  ok(res, await listPosts(req.query as unknown as ListPostsQuery, req.auth!.user.id));
});
export const getOne = asyncHandler(async (req, res) => {
  ok(res, await getPost(req.params.id as string, req.auth!.user.id));
});
export const create = asyncHandler(async (req, res) => {
  ok(res, await createPost(req.auth!.user, req.body as CreatePostInput), 201);
});
export const remove = asyncHandler(async (req, res) => {
  ok(res, await deletePost(req.auth!.user, req.params.id as string));
});
