import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const likeEntity = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;
  const userId = req.user._id;

  if (!videoId && !commentId && !tweetId) {
    throw new ApiError(400, "Entity ID is required to like");
  }

  if (videoId && commentId || videoId && tweetId || commentId && tweetId) {
    throw new ApiError(400, "Only one entity type can be liked at a time");
  }

  const likeData = {
    likedBy: userId,
    ...(videoId && { video: videoId }),
    ...(commentId && { comment: commentId }),
    ...(tweetId && { tweet: tweetId }),
  };

  const like = new Like(likeData);
  await like.save();

  res.status(201).json(new ApiResponse(201, like, "Entity liked successfully"));
});


const unlikeEntity = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;
  const userId = req.user._id;

  if (!videoId && !commentId && !tweetId) {
    throw new ApiError(400, "Entity ID is required to unlike");
  }

  if (videoId && commentId || videoId && tweetId || commentId && tweetId) {
    throw new ApiError(400, "Only one entity type can be unliked at a time");
  }

  const filter = {
    likedBy: userId,
    ...(videoId && { video: videoId }),
    ...(commentId && { comment: commentId }),
    ...(tweetId && { tweet: tweetId }),
  };

  const like = await Like.findOneAndDelete(filter);

  if (!like) {
    throw new ApiError(404, "Like not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Entity unliked successfully"));
});
export {
  likeEntity,
  unlikeEntity,
};
