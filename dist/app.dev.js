"use strict";

var createError = require("http-errors");

var express = require("express");

var path = require("path");

require("dotenv").config();

var cookieParser = require("cookie-parser");

var logger = require("morgan");

var cors = require("cors");

var authErrorMiddleware = require("./middlewares/auth/authErrorMiddleware");

var indexRouter = require("./routes/index");

var todosRouter = require("./routes/todos");

var usersRouter = require("./routes/users");

var app = express();

var swaggerUi = require("swagger-ui-express");

var swaggerDocument = require("./swagger.json"); // view engine setup


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.enable("trust proxy");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, "public")));
app.use(cors({
  origin: [process.env.API_URL, "http://localhost:3000", "https://questify-bdgrt.netlify.app/auth", process.env.CLIENT_URL],
  credentials: true,
  allowedHeaders: ["Content-Type", "Accept", "Origin", "X-Requested-With", "Authorization", "Set-Cookie", "update", "hrmt"]
}));
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use(authErrorMiddleware);
app.use("/api/todos", todosRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;