const { checkSchema } = require("express-validator");
const ValidationHelper = require("../helpers/validation");

class AuthController {
  constructor({ userService }) {
    this.userService = userService;
  }

  login() {
    return [this.loginValidator, this.loginHandler];
  }

  loginValidator = ValidationHelper.validate(
    checkSchema({
      email: { exists: { errorMessage: "email required" } },
      password: { exists: { errorMessage: "password required" } },
    })
  );

  async loginHandler(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login({ email, password });
      return res.json({ token, message: "Logged Login" });
    } catch (error) {
      next(error);
    }
  }

  register() {
    return [this.registerValidator, this.registerHandler];
  }

  registerValidator = ValidationHelper.validate(
    checkSchema({
      email: { exists: { errorMessage: "email required" } },
      name: { exists: { errorMessage: "name required" } },
      password: {
        exists: { errorMessage: "password required" },
        isLength: {
          options: { min: 8 },
          errorMessage: "minimal password length 8",
        },
      },
    })
  );

  async registerHandler(req, res, next) {
    try {
      const { email, name, password } = req.body;
      const data = await this.userService.register({ email, name, password });
      return res.status(201).json({ data, message: "Registered" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
