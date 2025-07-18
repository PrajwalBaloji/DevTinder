const express = require("express");
const { auth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status))
        throw new Error(`Invalid Status ${status}`);

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "user not found",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection between you and sender already exists",
        });
      }

      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connection.save();
      res.json({
        message: "request sent successfully",
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  auth,
  async (req, res) => {
    try {
      const user = req.user;
      const acceptedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      console.log({ status, requestId });
      const isValidStatus = acceptedStatus.includes(status);
      if (!isValidStatus) throw new Error("Not a valid status");

      const connection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });
      if (!connection) throw new Error("No connections found");
      connection.status = status;
      const data = await connection.save();
      res.json({ message: `connection ${status}`, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
module.exports = requestRouter;
