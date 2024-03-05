import axios from "axios";
import { UserModel } from "../models/userModel.js";
import { messageModel } from "../models/messageModel.js";

const addMessage = async (req, res) => {
  try {
    const from = req.user.id;
    const { to, message } = req.body;

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (!data) {
      return res.json({ msg: "Erro adding message to database !" });
    }

    return res.status(201).send({ msg: "Message added successfully !" });
  } catch (error) {
    console.log(`Error adding Message ${error.response}`);
  }
};

const getAllMessage = async (req, res) => {
  try {
    const from = req.user.id;
    const { to } = req.body;

    /*      const messages = await messageModel.aggregate([
      {
        $match: {
          users: { $all: [from, to] },
        },
      },
      {
        $addFields: {
          fromSelf: { $eq: ["$sender", from] },
          message: "$message.text",
        },
      },
      {
        $project: {
          _id: 0,
          fromSelf: 1,
          message: 1,
        },
      },
      {
        $sort: {
          updatedAt: 1,
        },
      },
    ]); */

    const messages = await messageModel
      .find({
        users: { $all: [from, to] },
      })
      .sort({
        udatedAt: 1,
      });

    const msgs = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(msgs);
  } catch (error) {
    console.log(`Error getting Messages ${error}`);
  }
};

export default {
  addMessage,
  getAllMessage,
};
