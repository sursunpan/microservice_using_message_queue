const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("=========DB CONNECTED ============================");
  } catch (err) {
    console.error(
      "===============Error ======= ON DB CONNECTION===================="
    );
    console.log(err);
  }
};
