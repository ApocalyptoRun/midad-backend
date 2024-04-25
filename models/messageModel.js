import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recepientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messageType: {
    type: String,
    enum: ["text", "image", "audio", "document"],
  },
  message: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

export const messageModel = mongoose.model("Message", messageSchema);
