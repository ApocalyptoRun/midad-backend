import jwt from "jsonwebtoken";
import { generateOPT } from "../utils/functions.js";
import { UserModel } from "../models/userModel.js";
import { sendSmsVonage } from "../utils/sendSmsVonage.js";

let existingOTP, user;

const sendOTP = async (req, res) => {
  let exist = false;
  const { phoneNumber } = req.body;

  const existingUser = await UserModel.findOne({ phoneNumber });
  if (existingUser) {
    exist = true;
  }

  existingOTP = generateOPT();

  console.log("OTP :", existingOTP);
  //sendSmsVonage(phoneNumber, existingOTP);

  user = existingUser ? existingUser : new UserModel({ phoneNumber });

  res.json({ code: existingOTP, existingUser: exist });
};

const verifyOTP = async (req, res) => {
  const { OTP } = req.body;

  if (existingOTP !== OTP) {
    return res.status(400).json({ msg: "Incorrect OTP" });
  }

  user = await user.save();

  return res.status(201).send(user);
};

const signin = async (req, res) => {
  const { phoneNumber } = req.body;

  const user = await UserModel.findOne({ phoneNumber });
  if (!user) {
    return res
      .status(404)
      .json({ msg: `User with the number ${phoneNumber} do not exist !` });
  }

  const accessToken = jwt.sign(
    {
      user: {
        phoneNumber: user.phoneNumber,
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "365d" }
  );

  return res.status(200).json({ accessToken });
};

const authenticateToken = (req, res) => {
  res.json(req.user);
};

export default {
  sendOTP,
  signin,
  verifyOTP,
  authenticateToken,
};
