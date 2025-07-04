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

    await user.save();
    res.send("user created");
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Inavlid credentials");
    }
    const isvalidPassword = await user.validateUser(password);
    if (!isvalidPassword) {
      throw new Error("Inavlid credentials");
    }

    const token = await user.getToken(user._id);

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send("Login successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("User has been logged out");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
