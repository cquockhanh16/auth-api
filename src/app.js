// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const expressRateLimit = require("express-rate-limit");
const app = express();
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request trong 15 phút
});

const connectDB = require("./configs/db-config");

// require router
const appRouter = require("./routers/app-routers");

app.set("view engine", "ejs"); // Đặt view engine là EJS
app.set("views", path.join(__dirname, "views")); // Thư mục chứa các file EJS

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.use("/api", appRouter);

// connect database
connectDB();

// handle api not declared
app.use((req, res) => {
  return res
    .status(404)
    .json({ sts: false, err: "API not declared!!", data: null });
});

// router handle error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    sts: false,
    err: error.message ? error.message : error ? error : "Error from server",
    data: null,
  });
});

// Export app để sử dụng trong file server.js
module.exports = app;
