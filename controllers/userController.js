import axios from "axios";
import { UserModel } from "../models/userModel.js";

const updateUserDetails = async (req, res) => {
  const { id } = req.user;

  const result = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }

  return res
    .status(200)
    .send({ message: "User updated successfully", data: result });
};

const getUsers = (req, res) => {
  const loggedInUserId = req.user.id;

  UserModel.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log("Error retrieving users", error);
      res.status(500).json({ message: "Error retrieving users" });
    });
};

const postFriendRequest = async (req, res) => {
  const currentUserId = req.user.id;
  const { selectedUserId } = req.body;

  try {
    await UserModel.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    await UserModel.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendsRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(`Sending friend request error ${error}`);
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await UserModel.findById(id)
      .populate("friendRequests", "firstName phoneNumber imageUrl")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(`Errot getting friend request ${error}`);
  }
};

export default {
  updateUserDetails,
  getUsers,
  postFriendRequest,
  getFriendRequests,
};
