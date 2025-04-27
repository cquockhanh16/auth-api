const mongoose = require("mongoose");
const { Schema } = mongoose;

const salarysheetSchema = new Schema({
  employee_id: {
    type: String,
    ref: "Employee",
  },
  month: Number,
  salary: Number,
  standardWorkingDays: { type: Number, required: true }, // Số công chuẩn trong tháng
  actualWorkingDays: { type: Number, required: true }, // Số công đi làm
  baseSalary: { type: Number, required: true }, // Lương cơ bản
  paidLeaveSalary: { type: Number, default: 0 }, // Lương nghỉ hưởng lương
  overtimeWeekdaySalary: { type: Number, default: 0 }, // Lương tăng ca ngày thường
  overtimeHolidaySalary: { type: Number, default: 0 }, // Lương tăng ca ngày lễ
  bonus: { type: Number, default: 0 }, // Tiền thưởng
  fine: { type: Number, default: 0 }, // Tiền phạt
  unpaidLeaveFine: { type: Number, default: 0 }, // Phạt nghỉ không phép
});

module.exports = mongoose.model("SalarySheet", salarysheetSchema);
