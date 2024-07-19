const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const ErrorHandler = require("./utlis/error-handlers");
const { product, appEvent } = require("./api");

module.exports = async (app, channel) => {
  app.use(express.json());
  app.use(cors());

  app.use(express.static(__dirname + "/public"));
  app.use(ErrorHandler);

  app.use(logger("dev"));

  /*=================================Listener==================================*/
  // appEvent(app);
  /*=================================Api==================================*/
  product(app, channel);
};
