const { Schema, model } = require("mongoose");
const BcryptHelper = require("../../money_app_backend/helpers/bcrypt");

const schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

schema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = BcryptHelper.make(user?.password);
  next();
});

const User = model("User", schema);

module.exports = User;
