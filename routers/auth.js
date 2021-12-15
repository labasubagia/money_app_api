const { Router } = require("express");
const AuthController = require("../controllers/auth");
const UserService = require("../services/user");
const User = require("../models/user");

const authRouter = Router();

const controller = new AuthController({
  userService: new UserService({ userModel: User }),
});

authRouter.post("/login", ...controller.login());
authRouter.post("/register", ...controller.register());

module.exports = authRouter;
