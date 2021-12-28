const moment = require("moment");
const { Types } = require("mongoose");
const CategoryConfig = require("../config/category");

const CashFlowPipeline = {
  byUserSummary({
    categoryModel,
    user_id,
    start_date = moment().startOf("month"),
    end_date = moment().endOf("month"),
  }) {
    const startDate = moment(start_date).startOf("day").toDate();
    const endDate = moment(end_date).endOf("day").toDate();
    return [
      { $match: { user_id: Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: categoryModel.collection.name,
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
                    { $gte: ["$date", startDate] },
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
                    { $gte: ["$date", startDate] },
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
                    { $gte: ["$date", startDate] },
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
  },

  byUserWithCategory({
    categoryModel,
    user_id,
    start_date = moment().startOf("month"),
    end_date = moment().endOf("month"),
  }) {
    const startDate = moment(start_date).startOf("day").toDate();
    const endDate = moment(end_date).endOf("day").toDate();
    return [
      {
        $match: {
          user_id: Types.ObjectId(user_id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: categoryModel.collection.name,
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
      { $sort: { date: -1, name: 1 } },
    ];
  },
};

module.exports = CashFlowPipeline;
