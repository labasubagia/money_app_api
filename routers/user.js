const { Router } = require("express");
const UserController = require("../controllers/user");
const UserService = require("../services/user");
const User = require("../models/user");

const userRouter = Router();

const controller = new UserController({
  userService: new UserService({ userModel: User }),
});

userRouter.get("/", ...controller.getProfile());
userRouter.post("/", ...controller.update());

module.exports = userRouter;
