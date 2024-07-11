import { Router } from "express";
import { likeEntity, unlikeEntity } from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/like", likeEntity);
router.post("/unlike", unlikeEntity);

export default router;
