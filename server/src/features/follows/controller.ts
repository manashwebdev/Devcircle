import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import type { FeedQuery } from './schema';
import { followingFeed, isFollowing, listFollowing, toggleFollow } from './service';

export const state = asyncHandler(async (req, res) => ok(res, await isFollowing(req.auth!.user, req.params.username as string)));
export const toggle = asyncHandler(async (req, res) => ok(res, await toggleFollow(req.auth!.user, req.params.username as string)));
export const people = asyncHandler(async (req, res) => ok(res, await listFollowing(req.auth!.user)));
export const feed = asyncHandler(async (req, res) => ok(res, await followingFeed(req.auth!.user, req.query as unknown as FeedQuery)));
