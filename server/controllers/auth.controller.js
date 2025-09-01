import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errors.js";

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

export default { signup };
