const bcrypt = require("bcrypt");

const BcryptHelper = {
  make(payload) {
    return bcrypt.hashSync(payload, 10);
  },

  compare(payload, encrypted) {
    return bcrypt.compareSync(payload, encrypted);
  },
};

module.exports = BcryptHelper;
