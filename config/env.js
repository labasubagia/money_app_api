const dotenv = require("dotenv");

dotenv.config();

const Env = {
  PORT: process.env.PORT,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
};

module.exports = Env;
