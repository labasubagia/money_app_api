const { Schema, model, Types } = require("mongoose");
const User = require("./user");
const CategoryConfig = require("../config/category");

const schema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: User,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: CategoryConfig.TYPES,
      default: CategoryConfig.EXPENSE,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const Category = model("Category", schema);

module.exports = Category;
