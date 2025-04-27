const mongoose = require("mongoose");
const { Schema } = mongoose;

const rewardDisciplineSchema = new Schema({
  employee_id: {
    type: String,
    ref: "Employee",
  },
  workday: Number,
  type: {
    type: String,
    enum: ["Phạt", "Thưởng"],
    default: "Thưởng",
  },
  reason: String,
  amount: Number,
});

module.exports = mongoose.model("RewardDiscipline", rewardDisciplineSchema);
