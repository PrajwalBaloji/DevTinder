const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Connecting...");

  await mongoose.connect(
    "mongodb+srv://prajwalnamastedev:3s0wFkjOChqOKXYD@namastenode.4cw1dre.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
