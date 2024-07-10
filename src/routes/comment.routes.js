import { Router } from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.get("/:videoId", getVideoComments);
router.post("/:videoId", addComment);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
