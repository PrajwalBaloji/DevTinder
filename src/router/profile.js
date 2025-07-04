const express = require("express");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const { validateEditFields } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", auth, (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit", auth, async (req, res) => {
  try {
    if (!validateEditFields(req)) {
      throw new Error("Invalid edit data");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({ message: "Updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/password", auth, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    const isvalidPassword = await user.validateUser(currentPassword);
    if (!isvalidPassword) throw new Error("Your current password dosent match");
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
