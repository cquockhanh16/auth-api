const AppServices = require("../services/app-service");

class AppControllers {
  static createUser = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.createUser(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create user success",
      });
    } catch (error) {
      next(error);
    }
  };

  static register = async (req, res, next) => {
    try {
      const { body } = req;
      const newAccount = await AppServices.register(body);
      res.status(201).json({
        sts: true,
        data: newAccount,
        err: null,
        mes: "create account success",
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { body } = req;
      const forwarded = req.headers["x-forwarded-for"];
      const ip = forwarded
        ? forwarded.split(",")[0]
        : req.connection.remoteAddress;
      const data = await AppServices.login(body, ip);
      res.status(200).json({
        sts: true,
        data: data,
        err: null,
        mes: "login success",
      });
    } catch (error) {
      next(error);
    }
  };

  static verifyMailOtp = async (req, res, next) => {
    try {
      const { body } = req;
      const data = await AppServices.verifyMailOtp(body);
      res.status(200).json({
        sts: true,
        data: data,
        err: null,
        mes: "verify mail success",
      });
    } catch (error) {
      next(error);
    }
  };

  static createProject = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.createProject(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create project success",
      });
    } catch (error) {
      next(error);
    }
  };

  static createFeedback = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.createFeedback(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create feedback success",
      });
    } catch (error) {
      next(error);
    }
  };

  static createCourse = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.createCourse(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create course success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getDataHome = async (req, res, next) => {
    try {
      const [user, project, course] = await Promise.all([
        AppServices.getUser(),
        AppServices.getCourse(),
        AppServices.getProject(),
      ]);
      res.status(200).json({
        sts: true,
        data: { user, project, course },
        err: null,
        mes: "get data home page",
      });
    } catch (error) {
      next(error);
    }
  };

  static getUser = async (req, res, next) => {
    try {
      const user = await AppServices.getUser();
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get user success",
      });
    } catch (error) {
      next(error);
    }
  };
  static getCourse = async (req, res, next) => {
    try {
      const user = await AppServices.getCourse();
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get course success",
      });
    } catch (error) {
      next(error);
    }
  };
  static getProject = async (req, res, next) => {
    try {
      const user = await AppServices.getProject();
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get project success",
      });
    } catch (error) {
      next(error);
    }
  };

  static addEmployee = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.addEmployee(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create employee success",
      });
    } catch (error) {
      next(error);
    }
  };

  static addTimesheet = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.addTimesheet(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create timesheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateTimesheet = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.updateTimesheet(body);
      res.status(200).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "update timesheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteTimesheetById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const newUser = await AppServices.deleteTimesheetById(id);
      res.status(200).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "delete timesheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllTimesheet = async (req, res, next) => {
    try {
      const { body, query } = req;
      console.log(body, query);
      const user = await AppServices.getAllTimesheet(body, query);
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get timesheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static addRewardDiscipline = async (req, res, next) => {
    try {
      const { body } = req;
      const newUser = await AppServices.addRewardDiscipline(body);
      res.status(201).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "create RewardDiscipline success",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateRewardDiscipline = async (req, res, next) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const newUser = await AppServices.updateRewardDiscipline(body, id);
      res.status(200).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "update RewardDiscipline success",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteRewardDisciplineById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const newUser = await AppServices.deleteRewardDisciplineById(id);
      res.status(200).json({
        sts: true,
        data: newUser,
        err: null,
        mes: "delete RewardDiscipline success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllRewardDiscipline = async (req, res, next) => {
    try {
      const { body, query } = req;
      const user = await AppServices.getAllRewardDiscipline(body, query);
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get RewardDiscipline success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getDetailSalarySheet = async (req, res, next) => {
    try {
      const { body } = req;
      const user = await AppServices.getDetailSalarySheet(body);
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get salary sheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static addTimesheetFromFileExcel = async (req, res, next) => {
    try {
      const { file } = req;
      const user = await AppServices.addTimesheetFromFileExcel(file);
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get salary sheet success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllAccount = async (req, res, next) => {
    try {
      const user = await AppServices.getAllAccount();
      res.status(200).json({
        sts: true,
        data: user,
        err: null,
        mes: "get account sheet success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AppControllers;
