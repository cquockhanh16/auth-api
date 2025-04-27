const mongoose = require("mongoose");
const { Schema } = mongoose;

const timesheetSchema = new Schema({
  employee_id: {
    type: String,
    ref: "Employee",
  },
  workday: Number,
  date_in: Number,
  date_out: Number,
});

module.exports = mongoose.model("Timesheet", timesheetSchema);
