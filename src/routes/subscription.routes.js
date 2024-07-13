import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJwt);

router.post("/:channelId",toggleSubscription);
router.get("/getUsers/:channelId",getUserChannelSubscribers);
router.get("/getChannels",getSubscribedChannels);

export default router;
