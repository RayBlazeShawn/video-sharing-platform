import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const comments = await Comment.find({ video: videoId })
    .populate("owner")
    .skip(skip)
    .limit(limitNumber);

  const totalComments = await Comment.countDocuments({ video: videoId });

  const totalPages = Math.ceil(totalComments / limitNumber);

  res.status(200)
    .json(new ApiResponse(200, {
        comments,
        meta: {
          totalComments,
          totalPages,
          currentPage: pageNumber,
        },
      },
      "Comments fetched successfully"));
});


const addComment = asyncHandler(async (req, res) => {

  const { content } = req.body;
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content is required for the comment");
  }

  if (content.length < 3) {
    throw new ApiError(400, "Content must be at least 3 characters long");
  }

  const comment = new Comment({
    content,
    video: videoId,
    owner: userId,
  });

  await comment.save();

  res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Content is required for the comment");
  }

  if (content.length < 3) {
    throw new ApiError(400, "Content must be at least 3 characters long");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: userId },
    { content },
    { new: true }
  );

  if (!updatedComment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: userId,
  });

  if (!deletedComment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};