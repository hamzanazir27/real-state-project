import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
async function signup(req, res, next) {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const keys = Object.keys(error.keyPattern);
      if (keys.includes("email") && keys.includes("username")) {
        return next(errorHandler(409, "Username and email already exist"));
      } else if (keys.includes("email")) {
        return next(errorHandler(409, "Email already exists"));
      } else if (keys.includes("username")) {
        return next(errorHandler(409, "Username already exists"));
      }
    }

    next(error); // for any other error
  }
}

async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) next(errorHandler(404, "Invalid Email"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) next(errorHandler(404, "Invalid Craditial"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...userData } = validUser._doc;
    res
      .cookie("acess-token", token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
}

async function googleAuth(req, res, next) {
  const { name, email, photo } = req.body;
  const user = await User.findOne({ email });
  console.log(req.body);
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...userData } = user._doc;
    res
      .cookie("acess-token", token, { httpOnly: true })
      .status(200)
      .json(userData);
  } else {
    try {
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const username =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...userData } = newUser._doc;
      res
        .cookie("acess-token", token, { httpOnly: true })
        .status(200)
        .json(userData);
    } catch (error) {
      next(error); // for any other error
    }
  }
}

export default { signup, signin, googleAuth };
