const { checkSchema } = require("express-validator");
const ValidationHelper = require("../helpers/validation");

class AuthController {
  constructor({ userService }) {
    this.userService = userService;
  }

  login() {
    return [this.loginValidator(), this.loginHandler()];
  }

  loginValidator() {
    return ValidationHelper.validate(
      checkSchema({
        email: {
          notEmpty: { errorMessage: "email required" },
          isEmail: { errorMessage: "invalid email" },
        },
        password: { notEmpty: { errorMessage: "password required" } },
      })
    );
  }

  loginHandler() {
    return async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const token = await this.userService.login({ email, password });
        return res.json({ token, message: "Login Success" });
      } catch (error) {
        next(error);
      }
    };
  }

  register() {
    return [this.registerValidator(), this.registerHandler()];
  }

  registerValidator() {
    return ValidationHelper.validate(
      checkSchema({
        email: {
          notEmpty: { errorMessage: "email required" },
          isEmail: { errorMessage: "invalid email" },
          custom: {
            options: async (value) => {
              const user = await this.userService.findByEmail(value);
              if (user) return Promise.reject("email already in use");
            },
          },
        },
        name: { notEmpty: { errorMessage: "name required" } },
        password: {
          notEmpty: { errorMessage: "password required" },
          isLength: {
            options: { min: 8 },
            errorMessage: "minimal password length 8",
          },
        },
      })
    );
  }

  registerHandler() {
    return async (req, res, next) => {
      try {
        const { email, name, password } = req.body;
        const data = await this.userService.register({ email, name, password });
        return res.status(201).json({ data, message: "Registered" });
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = AuthController;
