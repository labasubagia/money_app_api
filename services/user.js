const _ = require("lodash");
const { Types } = require("mongoose");
const BcryptHelper = require("../helpers/bcrypt");
const JwtHelper = require("../helpers/jwt");

class UserService {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  async login({ email, password }) {
    const user = await this.userModel.findOne({ email }).select("+password");
    if (!user) throw new Error("Email not registered yet");

    const isCorrect = BcryptHelper.compare(password, user?.password);
    if (!isCorrect) throw new Error("Invalid password");

    const payload = user.toObject();
    delete payload.password;
    const token = JwtHelper.generate(payload);
    return token;
  }

  async register({ email, name, password }) {
    let user = await this.userModel.create({ email, name, password });
    user = user.toObject();
    delete user.password;
    return user;
  }

  async update({ id, email, name, password }) {
    password = password ? BcryptHelper.make(password) : null;
    const payload = _.omitBy({ email, name, password }, _.isNil);
    const user = await this.userModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return user;
  }

  async getById(id) {
    return this.userModel.findById(id);
  }

  async findByEmail(email, excludedId = null) {
    const query = { email };
    if (excludedId) {
      query._id = { $ne: Types.ObjectId(excludedId) };
    }
    const user = await this.userModel.findOne(query);
    return user;
  }
}

module.exports = UserService;
