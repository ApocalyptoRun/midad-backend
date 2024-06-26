import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
});

export const UserModel = mongoose.model("User", userSchema);
