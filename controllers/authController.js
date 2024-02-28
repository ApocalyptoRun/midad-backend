import jwt from "jsonwebtoken";
import { sendSms, generateOPT } from "../utils/functions.js";
import { UserModel } from "../models/userModel.js";

let existingOTP, user;

const sendOTP = async (req, res) => {
  let exist = false;
  const { phoneNumber } = req.body;

  const existingUser = await UserModel.findOne({ phoneNumber });
  if (existingUser) {
    //return res.status(400).json({msg: "User with same number already exists!"})
    exist = true;
  }

  existingOTP = generateOPT();

  user = existingUser ? existingUser : new UserModel({ phoneNumber });

  ///sendSms(phoneNumber, existingOTP);

  res.json({ code: existingOTP, existingUser: exist });
};

const verifyOTP = async (req, res) => {
  const { OTP } = req.body;

  //console.log('existingOTP = '+existingOTP);
  //console.log('OTP = '+OTP);

  if (existingOTP != OTP) {
    return res.status(400).json({ msg: "Incorrect OTP" });
  }

  /// continue register
  /// User profile (phote and name)

  user = await user.save();

  return res.status(201).send(user);
};

const signin = async (req, res) => {
  const { phoneNumber } = req.body;

  console.log(phoneNumber);

  const user = await UserModel.findOne({ phoneNumber });
  if (!user) {
    return res
      .status(404)
      .json({ msg: `User with the number ${phoneNumber} do not exist !` });
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.name,
        phoneNumber: user.phoneNumber,
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({ accessToken });
};

export default { sendOTP, signin, verifyOTP };
