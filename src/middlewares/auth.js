const userAuth = (req, res, next) => {
  const token = "xyzasd";
  const isvalidToken = token === "xyz";
  if (!isvalidToken) {
    res.status(401).send("user is not authorised");
    return;
  }
  next();
};

const adminAUth = (req, res, next) => {
  const token = "xyz";
  const isvalidToken = token === "xyz";
  if (!isvalidToken) {
    res.status(401).send("Admin is not authorised");
    return;
  }
  next();
};

module.exports = {
  userAuth,
  adminAUth,
};
