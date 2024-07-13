import mongoose, { isValidObjectId, Mongoose } from "mongoose";
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
  const {channelId} = req.params
  const userId = req.user._id

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const subscription = await Subscription.findOne({ subscriber: userId, channel: channelId });

  if (subscription) {
    await Subscription.deleteOne({ _id: subscription._id });
    res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully"));
  } else {
    const newSubscription = new Subscription({
      subscriber: userId,
      channel: channelId,
    });
    await newSubscription.save();
    res.status(200).json(new ApiResponse(200, newSubscription, "Subscribed successfully"));
  }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const subscriptionList = await Subscription.find({ channel: channelId }).populate("subscriber", "username");

  if (!subscriptionList) {
    throw new ApiError(404, "No channel found with id " + channelId);
  }

  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  res.status(200).json(new ApiResponse(200, {
    subscriptionList,
    meta: {
      totalSubscribers,
    },
  }, "Subscriber list fetched successfully"));
});


const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscriptions = await Subscription.find({ subscriber: userId }).populate("channel", "username");

  if (!subscriptions || subscriptions.length === 0) {
    throw new ApiError(404, "No subscriptions found for the user.");
  }

  res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
}