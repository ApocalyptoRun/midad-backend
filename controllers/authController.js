import jwt from "jsonwebtoken";
import {  generateOPT, sendSms } from "../utils/functions.js";
import { UserModel } from "../models/userModel.js";

let user;
let otpAndPhoneNumberMap = new Map();

const sendOTP = async (req, res) => {
  let exist = false;
  const { phoneNumber } = req.body;

  const existingUser = await UserModel.findOne({ phoneNumber });
  if (existingUser) {
    exist = true;
  }

  const existingOTP = generateOPT();
  if (existingOTP) {
    otpAndPhoneNumberMap.set(phoneNumber, existingOTP);
  }

  console.log("OTP :", existingOTP);
  sendSms(phoneNumber, existingOTP)

  user = existingUser ? existingUser : new UserModel({ phoneNumber });

  res.json({ code: existingOTP, existingUser: exist });
};

const verifyOTP = async (req, res) => {
  const { OTP, phoneNumber } = req.body;

  if (otpAndPhoneNumberMap.has(phoneNumber)) {
    const existingOTP = otpAndPhoneNumberMap.get(phoneNumber);
    if (existingOTP) {
      if (existingOTP !== OTP) {
        return res.status(400).json({ msg: "Incorrect OTP" });
      }

      user = await user.save();

      return res.status(201).send(user);
    }
  } else {
    return res.status(400).json({ msg: "Phone Number not found !" });
  }
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
