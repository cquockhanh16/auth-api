const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  phone_number: {
    type: String,
    minLength: 10,
    maxLength: 11,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
  },
  career_objective: {
    type: String,
  },
  skills: [
    {
      skill_name: String,
      description: [],
    },
  ],
  work_experience: [
    {
      company_name: String,
      position: String,
      start_time: Number,
      end_time: Number,
      description: String,
    },
  ],
  education: {
    type: {
      school_name: String,
      major: String,
      start_time: Number,
      end_time: Number,
    },
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
