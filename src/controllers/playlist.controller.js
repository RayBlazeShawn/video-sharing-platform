import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

const addEntity = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!videoId || !name || !description) {
    throw new ApiError(400, "Video ID, Name, and Description are required to add to playlist");
  }

  let playlist = await Playlist.findOne({ name, owner: userId });

  if (playlist) {
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
    }
  } else {
    playlist = new Playlist({
      owner: userId,
      videos: [videoId],
      name,
      description,
    });
  }

  await playlist.save();

  res.status(201).json(new ApiResponse(201, playlist, "Playlist saved successfully"));
});


const removeEntity = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;

  if (!videoId || !name) {
    throw new ApiError(400, "Video ID and Playlist Name are required to remove from playlist");
  }

  let playlist = await Playlist.findOne({ name, owner: userId });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const videoObjectId = new mongoose.Types.ObjectId(videoId);

  const videoIndex = playlist.videos.findIndex(video => video.equals(videoObjectId));

  if (videoIndex > -1) {
    playlist.videos.splice(videoIndex, 1);
  } else {
    throw new ApiError(404, "Video not found in playlist");
  }

  await playlist.save();

  res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
});


export {
  addEntity,
  removeEntity
};
