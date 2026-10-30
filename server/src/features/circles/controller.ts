import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import {
  createCircle,
  getCircle,
  joinByCode,
  kickMember,
  leaveCircle,
  listMyCircles,
  listPublicCircles,
  previewInvite,
  setVisibility,
} from './service';
import type { CreateCircleInput } from './schema';

export const mine = asyncHandler(async (req, res) => {
  ok(res, await listMyCircles(req.auth!.user));
});
export const publicList = asyncHandler(async (req, res) => {
  ok(res, await listPublicCircles(req.auth!.user));
});
export const create = asyncHandler(async (req, res) => {
  ok(res, await createCircle(req.auth!.user, req.body as CreateCircleInput), 201);
});
export const getOne = asyncHandler(async (req, res) => {
  ok(res, await getCircle(req.auth!.user, req.params.id as string));
});
export const update = asyncHandler(async (req, res) => {
  const { visibility } = req.body as { visibility: 'private' | 'public' };
  ok(res, await setVisibility(req.auth!.user, req.params.id as string, visibility));
});
export const invite = asyncHandler(async (req, res) => {
  ok(res, await previewInvite(req.params.code as string));
});
export const join = asyncHandler(async (req, res) => {
  ok(res, await joinByCode(req.auth!.user, req.params.code as string));
});
export const leave = asyncHandler(async (req, res) => {
  ok(res, await leaveCircle(req.auth!.user, req.params.id as string));
});
export const kick = asyncHandler(async (req, res) => {
  ok(res, await kickMember(req.auth!.user, req.params.id as string, req.params.userId as string));
});