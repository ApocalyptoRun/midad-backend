import { messageModel } from "../models/messageModel.js";

const getAllMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recepientId } = req.body;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: senderId, recepientId: recepientId },
          { senderId: recepientId, recepientId: senderId },
        ],
      })
      .populate("senderId", "_id firstName");

    res.json(messages);
  } catch (error) {
    console.log(`Error adding message ${error}`);
  }
};

const addMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recepientId, messageType, messageText } = req.body;

    const newMessage = new messageModel({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: (() => {
        switch (messageType) {
          case "image":
            return `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`;
          case "audio":
            return `${req.protocol}://${req.get("host")}/uploads/audio/${req.file.filename}`;
          case "text":
            return null;
        }
      })(),
    });

    await newMessage.save();
    await newMessage.populate("senderId", "_id firstName");
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(`Error adding message ${error}`);
  }
};

export default {
  addMessage,
  getAllMessage,
};
