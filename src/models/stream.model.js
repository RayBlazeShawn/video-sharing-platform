import mongoose, { Schema } from "mongoose";

const streamSchema = new Schema(
  {
    streamId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    thumbnailUrl: {
      type: String
    },
    viewers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Stream = mongoose.model("Stream", streamSchema);
