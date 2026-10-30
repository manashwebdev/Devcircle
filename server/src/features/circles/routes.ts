import { Router } from 'express';
import { requireAuth } from '../../core/authMiddleware';
import { writeLimiter } from '../../core/rateLimit';
import { validate } from '../../core/validate';
import { checkinCreate, checkinsList, create, getOne, invite, join, kick, leave, mine, publicList, update } from './controller';
import { circleIdParam, createCheckinBody, createCircleBody, dayQuery, inviteCodeParam, kickParams, updateCircleBody } from './schema';

export const router = Router();
router.use(requireAuth); // developers only

router.get('/', mine);
router.get('/public', publicList);
router.post('/', writeLimiter, validate({ body: createCircleBody }), create);
router.get('/invite/:code', validate({ params: inviteCodeParam }), invite);
router.post('/join/:code', writeLimiter, validate({ params: inviteCodeParam }), join);
router.get('/:id', validate({ params: circleIdParam }), getOne);
router.patch('/:id', writeLimiter, validate({ params: circleIdParam, body: updateCircleBody }), update);
router.post('/:id/leave', writeLimiter, validate({ params: circleIdParam }), leave);
router.delete('/:id/members/:userId', writeLimiter, validate({ params: kickParams }), kick);
router.get('/:id/checkins', validate({ params: circleIdParam, query: dayQuery }), checkinsList);
router.post('/:id/checkins', writeLimiter, validate({ params: circleIdParam, body: createCheckinBody }), checkinCreate);