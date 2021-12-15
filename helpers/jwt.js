const jwt = require("jsonwebtoken");

const JwtHelper = {
  generate(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  },

  decode(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = JwtHelper;
