const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("test");
});

app.use("/", (req, res) => {
  res.send("One home page");
});

app.listen(3000, () => {
  console.log("Server is up and running and is listening to port 3000");
});
