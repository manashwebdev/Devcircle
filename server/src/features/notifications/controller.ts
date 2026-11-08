import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { listNotifications, markAllRead, markRead, unreadCount } from './service';

export const list = asyncHandler(async (req, res) => ok(res, await listNotifications(req.auth!.user.id)));
export const count = asyncHandler(async (req, res) => ok(res, await unreadCount(req.auth!.user.id)));
export const readAll = asyncHandler(async (req, res) => ok(res, await markAllRead(req.auth!.user.id)));
export const readOne = asyncHandler(async (req, res) => ok(res, await markRead(req.auth!.user.id, req.params.id as string)));
