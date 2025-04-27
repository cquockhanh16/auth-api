const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  employee_id: String,
  employee_name: String,
  employee_salary: Number,
});

module.exports = mongoose.model("Employee", employeeSchema);
