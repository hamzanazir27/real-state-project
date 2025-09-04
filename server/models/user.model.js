import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1756985011~exp=1756988611~hmac=feddf1db8cef59cf1c41be1554173dbcdadbec73b0124ed82523688861483081&w=1480",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
