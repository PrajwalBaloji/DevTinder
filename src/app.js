const express = require("express");

const app = express();

app.get("/user/:userId/:username/:password", (req, res) => {
  console.log(req.params);

  res.send(req.query);
});

app.post("/user", (req, res) => {
  res.send("Post user succesfull");
});

app.use("/test", (req, res) => {
  res.send("Test page");
});

app.use("/", (req, res) => {
  res.send("Home page");
});

app.listen(7777, () => {
  console.log("Server is up and running and is listening to port 3000");
});
