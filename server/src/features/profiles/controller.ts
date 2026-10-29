import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { getProfile, updateProfile } from './service';
import type { UpdateProfileInput } from './schema';

// Controllers stay thin: read the request, call the service, send the reply.
export const getOne = asyncHandler(async (req, res) => {
  ok(res, await getProfile(req.params.username as string));
});

export const updateMe = asyncHandler(async (req, res) => {
  ok(res, await updateProfile(req.auth!.user, req.body as UpdateProfileInput));
});
