import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());



import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import videoRouter from "./routes/video.routes.js";
app.use("/api/v1/videos", videoRouter);

import commentRoutes from "./routes/comment.routes.js";
app.use("/api/v1/comments", commentRoutes);

import tweetRoutes from "./routes/tweet.routes.js";
app.use("/api/v1/tweets", tweetRoutes);

import likeRoutes from "./routes/like.routes.js";
app.use("/api/v1/likes",likeRoutes)

import playlistRoutes from "./routes/playlist.routes.js";
app.use("/api/v1/playlists",playlistRoutes)

import subscriptionRoutes from "./routes/subscription.routes.js";
app.use("/api/v1/toggle",subscriptionRoutes)


import streamRoutes from "./routes/stream.routes.js";
app.use("/api/v1/stream",streamRoutes)

export { app };