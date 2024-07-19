const express = require("express");
const { databaseConnection } = require("./database");
const expressApp = require("./expressApp");
const { PORT } = require("./config");
const { CreateChannel } = require("./utlis");

const StartServer = async () => {
  const app = express();
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`Customer service listen on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
