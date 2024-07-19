const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(
      "=======================DB CONNECTION CONNECTED================="
    );
  } catch (err) {
    console.log("=============DB CONNECTION PROBLEM================");
    console.log(err);
  }
};
