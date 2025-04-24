const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedBackSchema = new Schema({
  email: String,
  name: String,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Feedback", feedBackSchema);
