const _ = require("lodash");
const moment = require("moment");
const { Types } = require("mongoose");
const CategoryConfig = require("../config/category");

class CashFlowService {
  constructor({ cashFlowModel, categoryModel }) {
    this.cashFlowModel = cashFlowModel;
    this.categoryModel = categoryModel;
  }

  async getSummary({
    user_id,
    start_date = moment().startOf("month"),
    end_date = moment().endOf("month"),
  }) {
    const startDate = moment(start_date).startOf("day").toDate();
    const endDate = moment(end_date).endOf("day").toDate();
    console.log({ startDate, endDate });
    const pipeline = [
      { $match: { user_id: Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: this.categoryModel.collection.name,
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category" } },
      {
        $addFields: {
          category_name: "$category.name",
          category_type: "$category.type",
          category: "$$REMOVE",
          amount_value: {
            $cond: [
              { $eq: ["$category.type", CategoryConfig.INCOME] },
              "$amount",
              { $subtract: [0, "$amount"] },
            ],
          },
        },
      },
      {
        $facet: {
          all: [],
          all_date_range: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ["$date", startDate] },
                    { $lte: ["$date", endDate] },
                  ],
                },
              },
            },
          ],
          expense_date_range: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ["$date", startDate] },
                    { $lte: ["$date", endDate] },
                    { $eq: ["$category_type", CategoryConfig.EXPENSE] },
                  ],
                },
              },
            },
          ],
          income_date_range: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ["$date", startDate] },
                    { $lte: ["$date", endDate] },
                    { $eq: ["$category_type", CategoryConfig.INCOME] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          all: "$$REMOVE",
          all_date_range: "$$REMOVE",
          balance: { $sum: "$all.amount_value" },
          balance_date_range: {
            $sum: "$all_date_range.amount_value",
          },
          expense_date_range: {
            $abs: { $sum: "$expense_date_range.amount_value" },
          },
          income_date_range: {
            $sum: "$income_date_range.amount_value",
          },
        },
      },
    ];
    const data = await this.cashFlowModel
      .aggregate(pipeline)
      .allowDiskUse(true);
    return _.first(data);
  }

  async getByUser(userId) {
    const pipeline = [
      { $match: { user_id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: this.categoryModel.collection.name,
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category" } },
      {
        $addFields: {
          category_name: "$category.name",
          category_type: "$category.type",
          category: "$$REMOVE",
        },
      },
      { $sort: { created_at: -1, name: 1 } },
    ];
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
