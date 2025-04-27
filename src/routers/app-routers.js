const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const AppControllers = require("../controllers/app-controllers");

router.post("/auth/register", AppControllers.register);

router.post("/auth/login", AppControllers.login);

router.post("/auth/verify-mail", AppControllers.verifyMailOtp);

router.post("/create/user", AppControllers.createUser);

router.post("/create/course", AppControllers.createCourse);

router.post("/create/project", AppControllers.createProject);

router.post("/create/feedback", AppControllers.createFeedback);

router.get("/detail/user", AppControllers.getUser);

router.get("/list/course", AppControllers.getCourse);

router.get("/list/project", AppControllers.getProject);

router.get("/detail/home", AppControllers.getDataHome);

router.post("/list/timesheet", AppControllers.getAllTimesheet);

router.post("/create/employee", AppControllers.addEmployee);

router.post("/create/timesheet", AppControllers.addTimesheet);

router.put("/update/timesheet", AppControllers.updateTimesheet);

router.delete("/delete/timesheet/:id", AppControllers.deleteTimesheetById);

router.post("/list/reward-discipline", AppControllers.getAllRewardDiscipline);

router.post("/create/reward-discipline", AppControllers.addRewardDiscipline);

router.put(
  "/update/reward-discipline/:id",
  AppControllers.updateRewardDiscipline
);

router.delete(
  "/delete/reward-discipline/:id",
  AppControllers.deleteRewardDisciplineById
);

router.get("/detail/reward-discipline", AppControllers.getDetailSalarySheet);

router.post(
  "/read-file/timesheet",
  upload.single("file"),
  AppControllers.addTimesheetFromFileExcel
);

module.exports = router;
