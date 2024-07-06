import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/publish", upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), publishAVideo);

router.get("/", getAllVideos);

router.get("/:videoId", getVideoById);

router.put("/:videoId", upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), updateVideo);

router.delete("/:videoId", deleteVideo);

router.patch("/:videoId/toggle-publish", togglePublishStatus);

export default router;
