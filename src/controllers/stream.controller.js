import { Stream } from '../models/stream.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const startStream = asyncHandler(async (req, res) => {
  const { streamId, title, description } = req.body;

  if (!streamId || !title || !description) {
    throw new ApiError(400, "StreamId, title, and description are required");
  }

  const existingStream = await Stream.findOne({ streamId });
  if (existingStream) {
    throw new ApiError(400, "Stream already exists");
  }

  const stream = new Stream({
    streamId,
    title,
    description,
    owner: req.user._id,
    status: 'active'
  });

  await stream.save();

  res.status(201).json(new ApiResponse(201, stream, 'Stream started successfully'));
});

export const stopStream = asyncHandler(async (req, res) => {
  const { streamId } = req.body;

  if (!streamId) {
    throw new ApiError(400, "StreamId is required");
  }

  const stream = await Stream.findOne({ streamId, owner: req.user._id });

  if (!stream) {
    throw new ApiError(404, "Stream not found");
  }

  await stream.remove();

  res.status(200).json(new ApiResponse(200, {}, 'Stream stopped successfully'));
});

export const getActiveStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find({ status: 'active' }).populate('owner','username');
  res.status(200).json(new ApiResponse(200, streams, 'Active streams fetched successfully'));
});