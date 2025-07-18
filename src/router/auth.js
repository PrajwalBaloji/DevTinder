const express = require("express");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User added successfully", data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await user.validateUser(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await user.getToken();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login successful", data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.json({ message: "User has been logged out" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = authRouter;
