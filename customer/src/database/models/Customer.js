const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "address",
        require: "true",
      },
    ],
    /* =========== This cart data connected with other services ============ */
    cart: [
      {
        product: {
          _id: { type: String, require: true },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
        },
        unit: {
          type: Number,
          require: true,
        },
      },
    ],
    /* ============= This whislist data connected with other services ======= */
    wishlist: [
      {
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        available: { type: Boolean },
        price: { type: Number },
      },
    ],
    /* ================ This order data connected with other services ======= */
    orders: [
      {
        _id: { type: String, require: true },
        amount: { type: String },
        data: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", CustomerSchema);
