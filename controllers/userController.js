import { UserModel } from "../models/userModel.js";

const updateUserDetails = async (req, res) => {
  const { id } = req.user;
  const { firstName } = req.body;
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/images/${
    req.file.filename
  }`;

  const result = await UserModel.findByIdAndUpdate(
    id,
    { firstName, imageUrl },
    { new: true }
  );

  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User updated successfully" });
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

const compareContacts = async (req, res) => {
  try {
    const userContacts = req.body.phoneContacts;
    const loggedInUserId = req.user.id;

    const normalizedContacts = userContacts.map((contact) => {
      return contact.replace(/[()+\s-]|^00/g, "");
    });

    const matchedUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
      phoneNumber: { $in: normalizedContacts },
    });

    console.log(matchedUsers);

    res.json(matchedUsers);
  } catch (error) {
    console.error(`Error comparing contacts ${error}`);
  }
};

export default {
  updateUserDetails,
  getUsers,
  compareContacts,
};
