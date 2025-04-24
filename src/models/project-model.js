const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  project_name: {
    required: true,
    type: String,
  },
  position: String,
  description: String,
  start_time: Number,
  end_time: Number,
  link: String,
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Project", projectSchema);
