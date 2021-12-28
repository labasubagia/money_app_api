const _ = require("lodash");
const { Types, startSession } = require("mongoose");
const CashFlowPipeline = require("../aggregates/cashflow");
const FileHelper = require("../helpers/file");

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

  async getByUser({ user_id, start_date, end_date }) {
    const pipeline = CashFlowPipeline.byUserWithCategory({
      categoryModel: this.categoryModel,
      user_id,
      start_date,
      end_date,
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

  async create({ user_id, category_id, name, amount, note, date, receipt }) {
    const session = await startSession();
    try {
      session.startTransaction();
      let receipt_url = undefined;
      if (receipt) receipt_url = await FileHelper.uploadImage(receipt);

      const cashflow = this.cashFlowModel.create({
        user_id,
        category_id,
        name,
        amount,
        note,
        date,
        receipt_url,
      });
      await session.commitTransaction();
      await session.endSession();
      return cashflow;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async update({
    id,
    user_id,
    category_id,
    name,
    amount,
    note,
    date,
    receipt,
  }) {
    const session = await startSession();
    try {
      session.startTransaction();

      let receipt_url = undefined;
      if (receipt) receipt_url = await FileHelper.uploadImage(receipt);

      const query = {
        _id: Types.ObjectId(id),
        user_id: Types.ObjectId(user_id),
      };
      let payload = { category_id, name, amount, note, date };
      if (receipt_url) payload.receipt_url = receipt_url;
      payload = _.omitBy(payload, _.isUndefined);

      const cashflow = this.cashFlowModel.findOneAndUpdate(query, payload, {
        new: true,
      });
      await session.commitTransaction();
      await session.endSession();
      return cashflow;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async delete({ id, user_id }) {
    const query = { _id: Types.ObjectId(id), user_id: Types.ObjectId(user_id) };
    return this.cashFlowModel.findOneAndDelete(query, { new: true });
  }
}

module.exports = CashFlowService;
