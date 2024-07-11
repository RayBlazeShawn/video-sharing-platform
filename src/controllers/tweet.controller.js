import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = new Tweet({
    content,
    owner: userId,
  });

  await tweet.save();

  res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const tweets = await Tweet.find()
    .populate("owner", "username")
    .skip(skip)
    .limit(limitNumber);

  const totalTweets = await Tweet.countDocuments();
  const totalPages = Math.ceil(totalTweets / limitNumber);

  res.status(200).json(new ApiResponse(200, {
    tweets,
    meta: {
      totalTweets,
      totalPages,
      currentPage: pageNumber,
    },
  }, "Tweets fetched successfully"));
});

const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId).populate("owner", "username");

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  res.status(200).json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: userId },
    { content },
    { new: true },
  );

  if (!updatedTweet) {
    return res.status(404).json({ error: "Tweet not found" });
  }

  res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: userId,
  });

  if (!deletedTweet) {
    return res.status(404).json({ error: "Tweet not found" });
  }

  res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export {
  createTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
}