const { checkSchema } = require("express-validator");
const ValidationHelper = require("../helpers/validation");
const CategoryConfig = require("../config/category");

class CashFlowController {
  constructor({ cashFlowService }) {
    this.cashFlowService = cashFlowService;
  }

  getByUser() {
    return [this.getByUserHandler()];
  }

  getByUserHandler() {
    return async (req, res, next) => {
      const userId = req?.user?._id;
      const data = await this.cashFlowService.getByUser(userId);
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
      const data = await this.cashFlowService.getById({
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
        category_id: { exists: { errorMessage: "category_id required" } },
        amount: { exists: { errorMessage: "amount required" } },
        date: { exists: { errorMessage: "date required" } },
      })
    );
  }

  createHandler() {
    return async (req, res, next) => {
      try {
        const { name, category_id, amount, note, date } = req.body;
        const data = await this.cashFlowService.create({
          user_id: req?.user?._id,
          name,
          category_id,
          amount,
          note,
          date,
        });
        return res.status(201).json({ data, message: "Cash Flow created" });
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
        category_id: { optional: { options: { nullable: true } } },
        amount: { optional: { options: { nullable: true } } },
        date: { optional: { options: { nullable: true } } },
      })
    );
  }

  updateHandler() {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const { name, category_id, amount, note, date } = req.body;
        const data = await this.cashFlowService.update({
          id,
          user_id: req?.user?._id,
          category_id,
          name,
          amount,
          note,
          date,
        });
        return res.status(200).json({ data, message: "Cash Flow updated" });
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
        const data = await this.cashFlowService.delete({
          user_id: req?.user?._id,
          id,
        });
        return res.status(data ? 200 : 404).json({
          data,
          message: data ? "Cash Flow deleted" : "Cash Flow not found",
        });
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = CashFlowController;