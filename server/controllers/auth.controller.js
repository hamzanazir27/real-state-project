import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

async function signup(req, res) {
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
    console.error(error);
    res.status(500).json({ message: "User not created", error: error.message });
  }
}

export default { signup };
