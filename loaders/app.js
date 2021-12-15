const express = require("express");
const Env = require("../config/env");
const router = require("../routers");

class AppLoader {
  constructor() {
    this.port = Env.PORT;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(router);
    this.app.use(this.errorHandler);
  }

  async load() {
    this.app.listen(this.port, () => {
      console.log(`Server run at port ${this.port}`);
    });
  }

  async errorHandler(error, _, res, next) {
    if (res.headersSent) return next(error);
    error.status = error.status ? error.status : 500;
    return res.status(error.status).json({ message: error.message });
  }
}

module.exports = AppLoader;
