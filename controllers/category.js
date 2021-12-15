const { checkSchema } = require("express-validator");
const ValidationHelper = require("../helpers/validation");
const CategoryConfig = require("../config/category");

class CategoryController {
  constructor({ categoryService }) {
    this.categoryService = categoryService;
  }

  getByUser() {
    return [this.getByUserHandler()];
  }

  getByUserHandler() {
    return async (req, res, next) => {
      const userId = req?.user?._id;
      const data = await this.categoryService.getByUser(userId);
      return res.json({ data });
    };
  }

  getById() {
    return [this.getByIdValidator(), this.getByIdHandler()];
  }

  getByIdValidator() {
    return ValidationHelper.validate(
      checkSchema({ id: { exists: { errorMessage: "id required" } } })
    );
  }

  getByIdHandler() {
    return async (req, res, next) => {
      const { id } = req.params;
      const data = await this.categoryService.getById({
        user_id: req?.user?._id,
        id,
      });
      return res.status(data ? 200 : 404).json({ data });
    };
  }

  create() {
    return [this.createValidator(), this.createHandler()];
  }

  createValidator() {
    return ValidationHelper.validate(
      checkSchema({
        name: { exists: { errorMessage: "name required" } },
        type: {
          exists: { errorMessage: "type required" },
          isIn: {
            options: [CategoryConfig.TYPES],
            errorMessage: `type only in ${CategoryConfig.TYPES.join(", ")}`,
          },
        },
      })
    );
  }

  createHandler() {
    return async (req, res, next) => {
      try {
        const { name, type } = req.body;
        const data = await this.categoryService.create({
          user_id: req?.user?._id,
          name,
          type,
        });
        return res.status(201).json({ data, message: "Category created" });
      } catch (error) {
        next(error);
      }
    };
  }

  update() {
    return [this.updateValidator(), this.updateHandler()];
  }

  updateValidator() {
    return ValidationHelper.validate(
      checkSchema({
        name: { optional: { options: { nullable: true } } },
        type: {
          optional: { options: { nullable: true } },
          isIn: {
            options: [CategoryConfig.TYPES],
            errorMessage: `type only in ${CategoryConfig.TYPES.join(", ")}`,
          },
        },
      })
    );
  }

  updateHandler() {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const { name, type } = req.body;
        const data = await this.categoryService.update({
          id,
          user_id: req?.user?._id,
          name,
          type,
        });
        return res.status(201).json({ data, message: "Category updated" });
      } catch (error) {
        next(error);
      }
    };
  }

  delete() {
    return [this.deleteValidator(), this.deleteHandler()];
  }

  deleteValidator() {
    return ValidationHelper.validate(
      checkSchema({ id: { exists: { errorMessage: "id required" } } })
    );
  }

  deleteHandler() {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const data = await this.categoryService.delete({
          user_id: req?.user?._id,
          id,
        });
        return res.status(data ? 201 : 404).json({
          data,
          message: data ? "Category deleted" : "Category not found",
        });
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = CategoryController;
