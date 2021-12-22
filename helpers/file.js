const imgbbUploader = require("imgbb-uploader");
const Env = require("../config/env");

const FileHelper = {
  async uploadImage(file) {
    const data = await imgbbUploader({
      apiKey: Env.UPLOAD_IMG_TOKEN,
      base64string: file.buffer.toString("base64"),
    });
    return data.image.url || null;
  },
};

module.exports = FileHelper;
