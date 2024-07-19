const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const ErrorHandler = require("./utlis/error-handlers");
const customer = require("./api/customer");
const appEvent = require("./api/app-event");

module.exports = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use(logger("dev"));

  app.use((req, res, next) => {
    console.log("Initial Headers:", req.headers);
    next();
  });

  // appEvent(app);
  /* ============This routes used for only test========================== */
  // app.use("/", (req, res, next) => {
  //   return res.status(200).json({
  //     msg: "Hello From customer",
  //   });
  // });
  /* ==================================================================== */
  customer(app, channel);
  app.use(ErrorHandler);
};
