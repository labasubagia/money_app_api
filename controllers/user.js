const { checkSchema } = require("express-validator");
const ValidationHelper = require("../helpers/validation");

class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  update() {
    return [this.updateValidator(), this.updateHandler()];
  }

  updateValidator() {
    return ValidationHelper.validate(
      checkSchema({
        id: { exists: { errorMessage: "id required" } },
        email: {
          optional: { options: { nullable: true } },
          isEmail: { errorMessage: "invalid email" },
          custom: {
            options: async (value, { req }) => {
              const user = await this.userService.findByEmail(
                value,
                req.params?.id
              );
              if (user) return Promise.reject("email already in use");
            },
          },
        },
        name: { optional: { options: { nullable: true } } },
        password: {
          optional: { options: { nullable: true } },
          isLength: {
            options: { min: 8 },
            errorMessage: "minimal password length 8",
          },
        },
      })
    );
  }

  updateHandler() {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const { email, name, password } = req.body;
        const data = await this.userService.update({
          id,
          email,
          name,
          password,
        });
        return res.status(200).json({ data, message: "Updated" });
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = UserController;
