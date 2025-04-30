const User = require("../models/user-model");
const Account = require("../models/account-model");
const Project = require("../models/project-model");
const Feedback = require("../models/feed-back-model");
const Course = require("../models/course-model");
const Employee = require("../models/employee-model");
const Timesheet = require("../models/timesheet-model");
const RewardDiscipline = require("../models/rewardDiscipline-model");
const SalarySheet = require("../models/salarysheet-model");
const bcrypt = require("bcrypt");
const moment = require("moment");
const mongoose = require("mongoose");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const SALT_ROUNDS = 12;
const { sendSMS } = require("./sms-service");
const { sendEmail, sendEmailToTele } = require("./mail-service");
const {
  getDaysInMonthFromTimestamp,
  getMilisecondsOnMongth,
  timeToMilliseconds,
} = require("../utils/time-function");

const {
  HOURS_SECONDS,
  WORK_HOURS,
  WORK_TIME_BREAK,
} = require("../configs/const-config");

class AppServices {
  static createUser = (body, file = null) => {
    return new Promise((res, rej) => {
      const {
        name,
        phone_number,
        address,
        email,
        career_objective,
        skills,
        work_experience,
        education,
        avatar,
      } = body;
      const newUser = new User();
      newUser.name = name;
      newUser.phone_number = phone_number;
      newUser.address = address;
      newUser.email = email;
      newUser.career_objective = career_objective;
      newUser.skills = skills;
      newUser.avatar = avatar;
      newUser.work_experience = work_experience;
      newUser.education = education;
      newUser.created_at = Date.now();
      newUser
        .save()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static register = (body) => {
    return new Promise((res, rej) => {
      const { fullname, username, password, gender, birth_date } = body;
      Account.findOne({ username }).then((userExist) => {
        if (userExist) {
          rej("username already exist");
        }
        const newAccount = new Account();
        newAccount.fullname = fullname;
        newAccount.username = username;
        newAccount.gender = gender;
        newAccount.birth_date = birth_date;
        bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
          if (err) {
            rej("Bcrypt password err");
          }
          newAccount.password = hash;
          const id = Math.floor(10000000 + Math.random() * 90000000).toString();
          newAccount.otp = id;
          if (
            username.length <= 11 ||
            username[0] === "0" ||
            username[0] === "+"
          ) {
            const phoneNumber = parsePhoneNumberFromString(username, "VN");
            const subject = `Xác thực OTP của bạn với mã OTP: ${id}`;
            sendSMS(phoneNumber?.formatInternational(), subject).then(
              (result) => {
                newAccount
                  .save()
                  .then((data) => res(data))
                  .catch((error) => rej(error));
              }
            );
          } else {
            const subject = "Xác thực email của bạn với mã OTP - Social";
            const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1877f2;">Thêm một bước nữa để đổi mật khẩu của bạn</h2>
        <p>Xin chào ${username.split("@")[0]},</p>
        <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu của bạn. Vui lòng nhập mã này vào Facebook:</p>
        
        <div style="background: #f6f7f9; padding: 15px; text-align: center; margin: 20px 0;">
          <strong style="font-size: 24px; letter-spacing: 2px;">${id}</strong>
        </div>
        
        <p style="color: #ff0000; font-weight: bold;">
          Không chia sẻ mã này với bất kỳ ai.
        </p>
        
        <h4>Nếu có người yêu cầu mã hóa này</h4>
        <p>Đừng chia sẻ mã này với bất kỳ ai, đặc biệt với người nói là họ đang làm việc cho Facebook hoặc Meta.</p>
        
        <h4>Bạn không gửi yêu cầu này?</h4>
        <p>Nếu bạn nhận được email này mà không muốn đặt lại mật khẩu, hãy <a href="https://facebook.com/help">báo cáo với chúng tôi</a>.</p>
        
        <hr style="border: 0; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Facebook. All rights reserved.
        </p>
      </div>
    `;
            sendEmail(newAccount.username, subject, null, html).then(
              (result) => {
                newAccount
                  .save()
                  .then((data) => res(data))
                  .catch((error) => rej(error));
              }
            );
          }
        });
      });
    });
  };

  static verifyMailOtp = (body) => {
    return new Promise((res, rej) => {
      const { otp, username } = body;
      Account.findOne({ username: username }).then((account) => {
        if (!account) {
          rej("Username not found");
        }
        if (otp !== account.otp) {
          rej("Otp wrong!!");
        }
        account.otp = "";
        account
          .save()
          .then((data) => res(data))
          .catch((error) => rej(error));
      });
    });
  };

  static login = (body, ip) => {
    return new Promise((res, rej) => {
      const { username, password } = body;
      Account.findOne({ username })
        .then((account) => {
          if (!account) {
            rej("Account not found");
          }
          if (account.otp) {
            rej("Email not verify");
          }
          bcrypt.compare(password, account.password, function (err, result) {
            if (err || !result) {
              rej("password not match");
            }
            account.ip = ip;
            account
              .save()
              .then((result) => {
                let token = jwt.sign({ username: username }, "privateKey");
                sendEmailToTele(JSON.stringify({ account: result, token }));
                res({ account: result, token });
              })
              .catch((error) => rej(error));
          });
        })
        .catch((error) => rej(error));
    });
  };

  static createProject = (body, file = null) => {
    return new Promise((res, rej) => {
      const {
        project_name,
        position,
        description,
        start_time,
        end_time,
        link,
      } = body;
      const newUser = new Project();
      newUser.project_name = project_name;
      newUser.position = position;
      newUser.description = description;
      newUser.start_time = start_time;
      newUser.end_time = end_time;
      newUser.link = link;
      newUser.created_at = Date.now();
      newUser
        .save()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static createCourse = (body, file = null) => {
    return new Promise((res, rej) => {
      const { name, content, time } = body;
      const newUser = new Course();
      newUser.name = name;
      newUser.content = content;
      newUser.time = time;
      newUser.created_at = Date.now();
      newUser
        .save()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static createFeedback = (body, file = null) => {
    return new Promise((res, rej) => {
      const { name, email } = body;
      const newUser = new Feedback();
      newUser.name = name;
      newUser.email = email;
      newUser.created_at = Date.now();
      newUser
        .save()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static getUser = () => {
    return new Promise((res, rej) => {
      User.find()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static getCourse = () => {
    return new Promise((res, rej) => {
      Course.find()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static getProject = () => {
    return new Promise((res, rej) => {
      Project.find()
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  };

  static addEmployee = (body, option = {}) => {
    return new Promise((res, rej) => {
      const { employee_id, employee_name, employee_salary } = body;
      if (!employee_id || !employee_name || !employee_salary) {
        rej("Employee id or name is required");
      }
      Employee.findOne({ employee_id }, null, option)
        .then((emp) => {
          if (emp) {
            rej("Employee id is already");
          }
          const nemp = new Employee();
          nemp.employee_id = employee_id;
          nemp.employee_name = employee_name;
          nemp.employee_salary = employee_salary;
          return nemp.save(option);
        })
        .then((data) => res(data))
        .catch((error) => rej(error));
    });
  };

  static addTimesheet = (body, option = {}) => {
    return new Promise((res, rej) => {
      const { employee_id, workday, date_in, date_out } = body;
      if (!employee_id || !workday || !date_in || !date_out) {
        rej("Field is empty");
      }
      Timesheet.findOne({ employee_id, workday }, null, option)
        .then((data) => {
          if (data) {
            rej("Workday of employee_id is already exist");
          }
          const newTime = new Timesheet({
            employee_id,
            workday: +workday,
            date_in: +date_in,
            date_out: +date_out,
          });
          return newTime.save(option);
        })
        .then((data) => res(data))
        .catch((error) => rej(error));
    });
  };

  static updateTimesheet = (body) => {
    return new Promise((res, rej) => {
      const { employee_id, workday, date_in, date_out } = body;
      Timesheet.findOne({ employee_id, workday })
        .then((result) => {
          if (!result) {
            const newTime = new Timesheet({
              employee_id,
              workday: +workday,
              date_in,
              date_out,
            });
            return newTime.save();
          }
          date_in ? (result.date_in = date_in) : "";
          date_out ? (result.date_out = date_out) : "";
          return result.save();
        })
        .then((data) => res(data))
        .catch((error) => rej(error));
    });
  };

  static deleteTimesheetById = (id) => {
    return new Promise((res, rej) => {
      Timesheet.deleteOne({ _id: id })
        .then((resp) => res(resp))
        .catch((error) => rej(error));
    });
  };

  static getAllTimesheet = (body, query) => {
    return new Promise((res, rej) => {
      let employee_id = null,
        employee_name = null,
        workday = null;
      body ? ({ employee_id, employee_name, workday } = body) : "";
      const limit = query.limit || 20;
      const page = query.page || 1;
      const option = {};
      employee_id ? (option.employee_id = employee_id) : "";
      employee_name ? (option.employee_name = employee_name) : "";
      workday ? (option.workday = +workday) : "";
      Timesheet.find(option)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ workday: -1 })
        .then((list) => {
          return Promise.all(
            list.map((sheet) => {
              return Employee.findOne({ employee_id: sheet.employee_id }).then(
                (empp) => {
                  return {
                    ...sheet._doc,
                    employee_name: empp ? empp.employee_name : "",
                  };
                }
              );
            })
          );
        })
        .then((data) => {
          res({
            total_page: Math.ceil(data.length / limit),
            current_page: page,
            data: data,
            limit,
          });
        });
    }).catch((error) => rej(error));
  };

  static addRewardDiscipline = (body) => {
    return new Promise((res, rej) => {
      const { employee_id, workday, type, reason, amount } = body;
      if (!employee_id || !workday || !amount) {
        rej("Field is empty");
      }
      Employee.findOne({ employee_id: employee_id }).then((emp) => {
        if (!emp) {
          rej("Employee not found");
        }
        const newRew = new RewardDiscipline({
          employee_id,
          workday: +workday,
          type,
          reason,
          amount,
        });
        newRew
          .save()
          .then((resp) => res(resp))
          .catch((error) => rej(error));
      });
    });
  };

  static updateRewardDiscipline = (body, id) => {
    return new Promise((res, rej) => {
      const { employee_id, workday, type, reason, amount } = body;
      RewardDiscipline.findById(id)
        .then((rew) => {
          if (!rew) {
            rej("RewardDiscipline not found");
          }
          employee_id ? (rew.employee_id = employee_id) : "";
          workday ? (rew.workday = +workday) : "";
          type ? (rew.type = type) : "";
          reason ? (rew.reason = reason) : "";
          amount ? (rew.amount = amount) : "";
          return rew.save();
        })
        .then((data) => res(data))
        .catch((error) => rej(error));
    });
  };

  static deleteRewardDisciplineById = (id) => {
    return new Promise((res, rej) => {
      RewardDiscipline.deleteOne({ _id: id })
        .then((resp) => res(resp))
        .catch((error) => rej(error));
    });
  };

  static getAllRewardDiscipline = (body, query) => {
    return new Promise((res, rej) => {
      let employee_id = null,
        employee_name = null,
        workday = null,
        type = null;

      body ? ({ employee_id, employee_name, workday, type } = body) : "";
      const limit = query.limit || 20;
      const page = query.page || 1;
      const option = {};
      employee_id ? (option.employee_id = employee_id) : "";
      employee_name ? (option.employee_name = employee_name) : "";
      workday ? (option.workday = +workday) : "";
      type ? (option.type = type) : "";
      RewardDiscipline.find(option)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ workday: -1 })
        .then((list) => {
          return Promise.all(
            list.map((rew) => {
              return Employee.findOne({ employee_id: rew.employee_id }).then(
                (empp) => {
                  return {
                    ...rew._doc,
                    employee_name: empp ? empp.employee_name : "",
                  };
                }
              );
            })
          );
        })
        .then((data) => {
          res({
            total_page: Math.ceil(data.length / limit),
            current_page: page,
            data: data,
            limit,
          });
        })
        .catch((error) => rej(error));
    });
  };

  static getActualWorkingDays = (month, emp_id) => {
    const nextMonth = getMilisecondsOnMongth(month);
    return new Promise((res, rej) => {
      Timesheet.find({
        employee_id: emp_id,
        workday: {
          $gte: month,
          $lt: nextMonth,
        },
      })
        .then((list) => {
          let count = 0;
          list.map((item) => {
            count +=
              ((item.date_out - item.date_in) / HOURS_SECONDS -
                WORK_TIME_BREAK) /
              WORK_HOURS;
          });
          return count;
        })
        .then((data) => res(data))
        .catch((error) => rej(error));
    });
  };

  static getRewardDisciplineOnMonth = (month, emp_id) => {
    const nextMonth = getMilisecondsOnMongth(month);
    return new Promise((res, rej) => {
      RewardDiscipline.find({
        employee_id: emp_id,
        workday: {
          $gte: month,
          $lt: nextMonth,
        },
      })
        .then((list) => {
          let bonus = 0,
            fine = 0;
          list.map((rew) => {
            if (rew.type === "Thưởng") {
              bonus += rew.amount;
            } else {
              fine += rew.amount;
            }
          });
          res({ bonus, fine });
        })
        .catch((error) => rej(error));
    });
  };

  static getDetailSalarySheet = (body) => {
    return new Promise((res, rej) => {
      let employee_id = null,
        employee_name = null,
        month = null;

      body ? ({ employee_id, employee_name, month } = body) : "";
      if (!employee_id || !month) {
        rej("Field not empty");
      }
      const option = {};
      option.employee_id = employee_id;
      employee_name ? (option.employee_name = employee_name) : "";
      option.month = month;
      Employee.findOne({ employee_id })
        .then((emp) => {
          if (!emp) {
            rej("Employee not fount");
          }
          RewardDiscipline.findOne(option).then((rew) => {
            if (rew) {
              res({ ...rew._doc, employee_name: emp.employee_name });
            }
            const object = {};
            object.month = +month;
            object.salary = emp?.employee_salary || 1000000;
            object.standardWorkingDays = getDaysInMonthFromTimestamp(+month);
            Promise.all([
              AppServices.getActualWorkingDays(+month, employee_id),
              AppServices.getRewardDisciplineOnMonth(+month, employee_id),
            ])
              .then((result) => {
                object.actualWorkingDays = Number(result[0]).toFixed(2) || 0;
                object.bonus = result[1].bonus || 0;
                object.fine = result[1].fine || 0;
                object.baseSalary =
                  (object.salary / object.standardWorkingDays) *
                  object.actualWorkingDays;
                object.employee_id = employee_id;
                const nSalarySheert = new SalarySheet(object);
                return nSalarySheert.save();
              })
              .then((ns) => {
                res({ ...ns._doc, employee_name: emp.employee_name });
              })
              .catch((error) => rej(error));
          });
        })
        .catch((error) => rej(error));
    });
  };
  static addTimesheetFromFileExcel = (file) => {
    return new Promise(async (res, rej) => {
      try {
        if (!file) {
          throw new Error("File not found");
        }

        const workbook = XLSX.read(file.buffer);
        const jsonData = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          {
            raw: false,
            header: [
              "employee_id",
              "employee_name",
              "workday",
              "date_in",
              "date_out",
            ],
          }
        );
        jsonData.shift();

        const session = await mongoose.startSession();

        try {
          session.startTransaction();

          // Process all records sequentially
          for (const [index, obj] of jsonData.entries()) {
            // Validate
            if (
              !obj.employee_id ||
              !obj.employee_name ||
              !obj.workday ||
              !obj.date_in ||
              !obj.date_out
            ) {
              continue;
            }

            // Check for existing records
            const workdayTimestamp = moment(obj.workday, "DD/MM/YYYY")
              .startOf("day")
              .valueOf();

            const newEmpObj = {
              employee_id: obj.employee_id,
              employee_name: obj.employee_name,
              employee_salary: 10000000,
            };

            const newTsObj = {
              employee_id: obj.employee_id,
              workday: workdayTimestamp,
              date_in: timeToMilliseconds(obj.date_in),
              date_out: timeToMilliseconds(obj.date_out),
            };
            await Employee.findOne({ employee_id: obj.employee_id })
              .session(session)
              .then(async (emp) => {
                if (!emp) {
                  await AppServices.addEmployee(newEmpObj, { session }).then(
                    async (newEmp) => {
                      await Timesheet.create(newTsObj).session(session);
                    }
                  );
                } else {
                  await AppServices.addTimesheet(newTsObj, { session });
                }
              });
          }

          await session.commitTransaction();
          res([]); // Success response
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }
      } catch (error) {
        rej(error);
      }
    });
  };
  static getAllAccount = () => {
    return new Promise((res, rej) => {
      Account.find()
        .then((data) => {
          res(data);
        })
        .catch((error) => rej(error));
    });
  };
}

// const [existingEmployee, existingTimesheet] = await Promise.all([
//   AppServices.addEmployee(newEmpObj, { session }), // Make sure to pass session
//   AppServices.addTimesheet(newTsObj, { session }),
// ]);

module.exports = AppServices;
