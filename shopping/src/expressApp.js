const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const appEvents = require("./api/app-events");
const shopping = require("./api/shopping");
const ErrorHandler = require("./utlis/error-handlers");
const { CreateChannel } = require("./utlis");

module.exports = async (app, channel) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use(logger("dev"));

  /*====================Listener===================*/
  // appEvents(app);
  /*===============================================*/

  /*======================api======================*/
  shopping(app, channel);
  /*===============================================*/

  app.use(ErrorHandler);

  /*==========This is Only for testing Purpose======*/
  // app.use("/", (req, res, next) => {
  //   return res.status(200).json({
  //     msg: "shopping server start working",
  //   });
  // });
  /*=================================================*/
};
