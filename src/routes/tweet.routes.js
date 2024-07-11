import { Router } from "express";
import {
  createTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/", createTweet);
router.get("/", getAllTweets);
router.get("/:tweetId", getTweetById);
router.put("/:tweetId", updateTweet);
router.delete("/:tweetId", deleteTweet);

export default router;
