const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: String,
  content: String,
  time: Number,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Course", courseSchema);
