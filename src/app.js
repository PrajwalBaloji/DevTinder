const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestsRouter = require("./router/request");
const requestRouter = require("./router/request");
const userRouter = require("./router/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
