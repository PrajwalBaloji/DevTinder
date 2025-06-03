const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    await user.save();
    res.send("user created");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Inavlid credentials");
    }
    const isvalidPassword = await bcrypt.compare(password, user.password);
    if (!isvalidPassword) {
      throw new Error("Inavlid credentials");
    }
    res.send("Login successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body?.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted");
  } catch (error) {
    res.status(400).send("Error deleteing the user");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("No users found");
  }
});

connectDB()
  .then(() => {
    console.log("Database connectioin established");
    app.listen(7777, () => {
      console.log("Server is up and running and is listening to port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
