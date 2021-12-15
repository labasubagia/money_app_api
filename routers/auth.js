const { Router } = require("express");
const AuthController = require("../controllers/auth");
const UserService = require("../services/user");
const User = require("../models/user");

const authRouter = Router();

const controller = new AuthController({
  userService: new UserService({ userModel: User }),
});

authRouter.post("/login", controller.loginValidator, (req, res, next) => {
  return controller.login(req, res, next);
});
authRouter.post("/register", controller.registerValidator, (req, res, next) => {
  return controller.register(req, res, next);
});

module.exports = authRouter;
