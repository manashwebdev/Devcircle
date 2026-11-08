import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { listPosts, listUsers, setBanned, setHidden, stats } from './service';

export const getStats = asyncHandler(async (_req, res) => ok(res, await stats()));
export const users = asyncHandler(async (req, res) => ok(res, await listUsers((req.query as { q?: string }).q)));
export const ban = asyncHandler(async (req, res) => ok(res, await setBanned(req.auth!.user, req.params.id as string, (req.body as { banned: boolean }).banned)));
export const posts = asyncHandler(async (_req, res) => ok(res, await listPosts()));
export const hide = asyncHandler(async (req, res) => ok(res, await setHidden(req.params.id as string, (req.body as { hidden: boolean }).hidden)));
