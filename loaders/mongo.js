const { connect } = require("mongoose");
const Env = require("../config/env");

class MongoLoader {
  async load() {
    await connect(Env.MONGO_DB_URL, { dbName: Env.MONGO_DB_NAME });
  }
}

module.exports = MongoLoader;
