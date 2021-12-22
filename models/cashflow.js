const { Schema, model, Types } = require("mongoose");
const User = require("./user");
const Category = require("./category");

const schema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: User,
      required: true,
    },
    category_id: {
      type: Types.ObjectId,
      ref: Category,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    receipt_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const CashFlow = model("Cash_Flow", schema);

module.exports = CashFlow;
