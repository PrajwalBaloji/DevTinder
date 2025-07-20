const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Connecting...");

  await mongoose.connect(process.env.DATABSE_URI);
};

module.exports = connectDB;
