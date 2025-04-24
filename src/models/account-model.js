const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  fullname: String,
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  otp: {
    type: String,
  },
  ip: String,
  gender: String,
  birth_date: String,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Account", accountSchema);
