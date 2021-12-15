const AppLoader = require("./loaders/app");
const MongoLoader = require("./loaders/mongo");

const startServer = (...loaders) => {
  try {
    loaders.forEach(async (loader) => new loader().load());
  } catch (error) {
    console.log(error);
  }
};

startServer(MongoLoader, AppLoader);
