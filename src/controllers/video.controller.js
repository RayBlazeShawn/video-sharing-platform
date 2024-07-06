import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    filter.owner = userId;
  }

  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  const skip = (pageNumber - 1) * limitNumber;

  const videos = await Video.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber)
    .populate("owner");

  const totalVideos = await Video.countDocuments(filter);
  const totalPages = Math.ceil(totalVideos / limitNumber);

  res.status(200).json(new ApiResponse(200, {
    videos,
    meta: {
      totalVideos,
      totalPages,
      currentPage: pageNumber,
    },
  }, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  const requiredFields = [title, description, duration, req.files?.videoFile?.[0], req.files?.thumbnail?.[0]];

  if (requiredFields.some(field => !field)) {
    throw new ApiError(400, "All fields are required: title, description, videoFile, and thumbnail");
  }

  const videoFilePath = req.files.videoFile[0]?.path;
  const videoUpload = await uploadOnCloudinary(videoFilePath);
  if (!videoUpload?.url) {
    throw new ApiError(500, "Failed to upload video file");
  }

  const thumbnailPath = req.files.thumbnail[0]?.path;
  const thumbnailUpload = await uploadOnCloudinary(thumbnailPath);
  if (!thumbnailUpload?.url) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const video = new Video({
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    title,
    description,
    duration,
    owner: req.user._id,
  });

  await video.save();

  res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate("owner");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, duration } = req.body;
  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (duration) updateFields.duration = duration;

  if (req.files?.videoFile?.[0]) {
    const videoFilePath = req.files.videoFile[0]?.path;
    const videoUpload = await uploadOnCloudinary(videoFilePath);
    if (!videoUpload?.url) {
      throw new ApiError(500, "Failed to upload video file");
    }
    updateFields.videoFile = videoUpload.url;
  }

  if (req.files?.thumbnail?.[0]) {
    const thumbnailPath = req.files.thumbnail[0]?.path;
    const thumbnailUpload = await uploadOnCloudinary(thumbnailPath);
    if (!thumbnailUpload?.url) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }
    updateFields.thumbnail = thumbnailUpload.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, updateFields, { new: true }).populate("owner");

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.status(200).json(new ApiResponse(200, video, "Video publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
