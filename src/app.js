const express = require("express");
const { userAuth, adminAUth } = require("./middlewares/auth");

const app = express();

app.use(
  "/requestHandlers",
  (req, res, next) => {
    console.log("1st Request handlers");
    res.send("1st Request handlers");
    next();
  },
  (req, res) => {
    console.log("2nd Request handlers");
    res.send("2nd Request handlers");
  },
  (req, res) => {
    console.log("3rd Request handlers");
  },
  (req, res) => {
    console.log("4th Request handlers");
  }
);

// user routes with auth except login

app.get("/user/login", (req, res) => {
  res.send("User will be able to login without auth");
});

app.get("/user", userAuth, (req, res) => {
  res.send("All user data");
});

app.post("/user", userAuth, (req, res) => {
  res.send("Post user succesfull");
});

app.use("/test", (req, res) => {
  res.send("Test page");
});

// admin route with global login

app.use("/admin", adminAUth);

app.get("/admin", (req, res) => {
  res.send("Hello admin");
});

app.use("/", (req, res) => {
  res.send("Home page");
});

app.listen(7777, () => {
  console.log("Server is up and running and is listening to port 3000");
});
