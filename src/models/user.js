const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      required: true,
      type: String,
    },
    emailId: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value))
          throw new Error("This is not a valid email");
      },
    },
    password: {
      required: true,
      type: String,
      // validate: (value) => {
      //   if (!validator.isStrongPassword(value))
      //     throw new Error("Add a strong password");
      // },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} not valid gender",
      },
    },
    photoUrl: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
    },
    about: {
      type: String,
      default: "This is default introduction",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "DEV@dummy$7777", {
    expiresIn: `1day`,
  });

  return token;
};

userSchema.methods.validateUser = async function (password) {
  console.log({ password });

  const user = this;
  const isValidPassword = bcrypt.compare(password, user.password);
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
