const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user created");
  } catch (error) {
    res.status(400).send("Error creating the user");
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
    });
    res.send(updatedUser);
  } catch (error) {
    console.log({ error });

    res.status(400).send("Error updating the user");
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
