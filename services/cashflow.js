const _ = require("lodash");
const { Types } = require("mongoose");
const CashFlowPipeline = require("../aggregates/cashflow");

class CashFlowService {
  constructor({ cashFlowModel, categoryModel }) {
    this.cashFlowModel = cashFlowModel;
    this.categoryModel = categoryModel;
  }

  async getSummary({ user_id, start_date, end_date }) {
    const pipeline = CashFlowPipeline.byUserSummary({
      categoryModel: this.categoryModel,
      user_id,
      start_date,
      end_date,
    });
    const data = await this.cashFlowModel
      .aggregate(pipeline)
      .allowDiskUse(true);
    return _.first(data);
  }

  async getByUser(user_id) {
    const pipeline = CashFlowPipeline.byUserWithCategory({
      categoryModel: this.categoryModel,
      user_id,
    });
    return this.cashFlowModel.aggregate(pipeline).allowDiskUse(true);
  }

  async getById({ id, user_id }) {
    const query = {
      _id: Types.ObjectId(id),
      user_id: { $in: [Types.ObjectId(user_id), null] },
    };
    return this.cashFlowModel.findOne(query);
  }

  async create({ user_id, category_id, name, amount, note, date }) {
    return this.cashFlowModel.create({
      user_id,
      category_id,
      name,
      amount,
      note,
      date,
    });
  }

  async update({ id, user_id, category_id, name, amount, note, date }) {
    const query = { _id: Types.ObjectId(id), user_id: Types.ObjectId(user_id) };
    const payload = _.pickBy(
      { category_id, name, amount, note, date },
      _.identity
    );
    return this.cashFlowModel.findOneAndUpdate(query, payload, { new: true });
  }

  async delete({ id, user_id }) {
    const query = { _id: Types.ObjectId(id), user_id: Types.ObjectId(user_id) };
    return this.cashFlowModel.findOneAndDelete(query, { new: true });
  }
}

module.exports = CashFlowService;
