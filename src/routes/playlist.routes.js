import { Router } from "express";
import { addEntity, removeEntity } from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/:videoId", addEntity);
router.delete("/:videoId", removeEntity);

export default router;