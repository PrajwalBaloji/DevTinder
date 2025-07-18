const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("user is not authorised");
    }
    const { _id } = jwt.verify(token, "DEV@dummy$7777");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  auth,
};
