const _ = require("lodash");
const { Types } = require("mongoose");

class CashFlowService {
  constructor({ cashFlowModel }) {
    this.cashFlowModel = cashFlowModel;
  }

  async getByUser(userId) {
    return this.cashFlowModel
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
