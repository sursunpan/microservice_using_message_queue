const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
} = require("../config/index");

console.log(APP_SECRET, MESSAGE_BROKER_URL);

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    const payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

/*==========================Message Broker=======================*/

/*--------------------------Create a channel---------------------*/
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (err) {
    throw err;
  }
};
/*---------------------------------------------------------------*/

/*----------------------------Publish Message--------------------*/
module.exports.PublishMessage = async (channel, binding_key, message) => {
  console.log(binding_key);
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message sent from product");
  } catch (err) {
    throw err;
  }
};
/*---------------------------------------------------------------*/

/*----------------------------Subscribe Message------------------*/
module.exports.SubscribeMessage = async (channel, service, binding_key) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
    channel.consume(appQueue.queue, (data) => {
      console.log("received data in product");
      console.log(data.content.toString());
      service.SubscribeEvents(data.content.toString());
      channel.ack(data);
    });
  } catch (err) {
    throw err;
  }
};
/*---------------------------------------------------------------*/
