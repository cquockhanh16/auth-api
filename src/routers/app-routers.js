const express = require("express");

const router = express.Router();

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

module.exports = router;
