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
  try {
    if (false) {
      throw new Error("random error");
    }
    res.send("Hello admin");
  } catch (error) {
    res.status(500).send("Please contact support");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
    return;
  }
  res.send("Home page");
});
