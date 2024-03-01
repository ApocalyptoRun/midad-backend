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
      .populate("friendRequests", "firstName imageUrl email")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(`Errot getting friend request ${error}`);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const recepientId = req.user.id;
    const { senderId } = req.body;

    const sender = await UserModel.findById(senderId);
    const recepient = await UserModel.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.friendRequests = recepient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );
    sender.sentFriendsRequests = sender.sentFriendsRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "friend Request accepted Successfylly " });
  } catch (error) {
    console.log(`Error acceptieng friend request ${error}`);
  }
};

const compareContacts = async (req, res) => {
  try {
    const userContacts = req.body.phoneContacts;
    const loggedInUserId = req.user.id;

    const normalizedContacts = userContacts.map((contact) => {
      return contact.replace(/[+\s-]/g, "");
    });

    const matchedUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
      phoneNumber: { $in: normalizedContacts }
    });

    res.json(matchedUsers);
  } catch (error) {
    console.error(`Error comparing contacts ${error}`);
  }
};

export default {
  updateUserDetails,
  getUsers,
  postFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  compareContacts,
};
