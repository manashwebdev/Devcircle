import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { circleStreak, userStreak } from './service';

export const forUser = asyncHandler(async (req, res) => {
  ok(res, await userStreak(req.params.username as string));
});
export const forCircle = asyncHandler(async (req, res) => {
  ok(res, await circleStreak(req.auth!.user, req.params.id as string));
});