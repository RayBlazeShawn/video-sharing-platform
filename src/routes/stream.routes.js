import { Router } from 'express';
import { getActiveStreams, startStream, stopStream } from "../controllers/stream.controller.js";
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(verifyJwt);

router.post('/start', checkRole(['streamer', 'admin']), startStream);
router.post('/stop', checkRole(['streamer', 'admin']), stopStream);
router.get('/', getActiveStreams);

export default router;
