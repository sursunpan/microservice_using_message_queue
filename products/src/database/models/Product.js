const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  desc: String,
  banner: String,
  type: String,
  unit: String,
  price: String,
  available: String,
  suplier: String,
});

module.exports = mongoose.model("product", ProductSchema);
