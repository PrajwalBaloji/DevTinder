const express = require("express");
const { auth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";

userRouter.get("/user/requests/recieved", auth, async (req, res) => {
  try {
    const user = req.user;
    const recievedRequest = await ConnectionRequest.find({
      toUserId: user.id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched successfully",
      data: recievedRequest,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", auth, async (req, res) => {
  try {
    const user = req.user;
    const allConnections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: user.id,
          status: "accepted",
        },
        {
          fromUserId: user.id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId toUserId", USER_SAFE_DATA);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.equals(user._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/feed", auth, async (req, res) => {
  try {
    const user = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId , toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
