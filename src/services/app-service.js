const User = require("../models/user-model");
const Account = require("../models/account-model");
const Project = require("../models/project-model");
const Feedback = require("../models/feed-back-model");
const Course = require("../models/course-model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 12;
const { sendEmail } = require("./mail-service");

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
          const id = uuidv4();
          newAccount.otp = id;
          const subject = "Xác thực email của bạn với mã OTP - Social";
          const text = `Xin chào ${newAccount.username},
                    Bạn đang thực hiện xác thực email trên Social. 
                    Mã OTP của bạn là: ${newAccount.otp}
                    Vui lòng không chia sẻ mã này với bất kỳ ai.
                    Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ.
                    Trân trọng,
                    Đội ngũ Social`;
          sendEmail(newAccount.username, subject, text).then((result) => {
            newAccount
              .save()
              .then((data) => res(data))
              .catch((error) => rej(error));
          });
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
        console.log(account, otp, username);
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
}

module.exports = AppServices;
