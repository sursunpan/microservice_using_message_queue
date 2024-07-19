const express = require("express");
const { databaseConnection } = require("./database");
const { PORT } = require("./config");
const expressApp = require("./expressApp");
const { CreateChannel } = require("./utlis");

const StartServer = async () => {
  const app = express();
  app.use(express.json());
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`shopping app start listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
