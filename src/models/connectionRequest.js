const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "accepted"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("You cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
