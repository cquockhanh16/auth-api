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
}

module.exports = AppControllers;
