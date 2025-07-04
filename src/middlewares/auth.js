const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    const { _id } = jwt.verify(token, "DEV@dummy$7777");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("auth", user);

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  auth,
};
