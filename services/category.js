const _ = require("lodash");
const { Types } = require("mongoose");
const CashFlow = require("../models/cashflow");

class CategoryService {
  constructor({ categoryModel, cashFlowModel }) {
    this.categoryModel = categoryModel;
    this.cashFlowModel = cashFlowModel;
  }

  async getByUser(userId) {
    return this.categoryModel
      .find({
        user_id: { $in: [Types.ObjectId(userId), null] },
      })
      .sort([
        ["user_id", -1],
        ["type", 1],
        ["name", 1],
      ]);
  }

  async getById({ id, user_id }) {
    const query = {
      _id: Types.ObjectId(id),
      user_id: { $in: [Types.ObjectId(user_id), null] },
    };
    return this.categoryModel.findOne(query);
  }

  async create({ user_id, name, type }) {
    return this.categoryModel.create({ user_id, name, type });
  }

  async update({ id, user_id, name, type }) {
    const query = { _id: Types.ObjectId(id), user_id: Types.ObjectId(user_id) };
    const payload = _.omitBy({ name, type }, _.isUndefined);
    return this.categoryModel.findOneAndUpdate(query, payload, { new: true });
  }

  async delete({ id, user_id }) {
    const query = { _id: Types.ObjectId(id), user_id: Types.ObjectId(user_id) };
    const cashFlowCount = await this.cashFlowModel
      .find({
        category_id: query._id,
        user_id: query.user_id,
      })
      .countDocuments();
    if (cashFlowCount)
      throw new Error(
        `Cannot delete category cause it has ${cashFlowCount} cashflow`
      );
    return this.categoryModel.findOneAndDelete(query, { new: true });
  }
}

module.exports = CategoryService;
