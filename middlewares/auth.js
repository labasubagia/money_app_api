const JwtHelper = require("../helpers/jwt");

const auth = (req, res, next) => {
  token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Please Login" });
  req.user = JwtHelper.decode(token);
  next();
};

module.exports = { auth };
