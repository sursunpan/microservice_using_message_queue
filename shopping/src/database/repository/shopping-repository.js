const { APIError } = require("../../utlis/app-errors");
const { OrderModel, CartModel } = require("../../database/models/index");
const { STATUS_CODES } = require("../../utlis/app-errors");
const uuidv4 = require("uuid").v4;

class ShoppingRepository {
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async OrderById(orderId) {
    try {
      const order = await OrderModel.findOne({ _id: orderId });
      return order;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({
        customerId: customerId,
      });

      return cartItems;
    } catch (err) {
      throw new Error("Unable to Find Orders");
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      console.log("item---->", item);

      const cart = await CartModel.findOne({ customerId: customerId });
      const { _id } = item;

      if (cart) {
        let isExist = false;
        let cartItems = cart.items;
        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }
        if (!isExist && !isRemove) {
          cart.push({ product: { ...item }, unit: qty });
        }
        cart.items = cartItems;
        return await cart.save();
      } else {
        console.log("suraj pandey");
        return await CartModel.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("Unable to Add To Cart");
    }
  }

  async CreateNewOrder(customerId, txnId) {
    try {
      const cart = await CartModel.findOne({ customerId: customerId });
      console.log("cart------->", cart);
      if (cart) {
        let amount = 0;
        let cartItems = cart.items;
        if (cartItems.length > 0) {
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();
          const order = await OrderModel.create({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });
          console.log("order------->", order);
          cart.items = [];
          await cart.save();
          return order;
        }
      }
      return {};
    } catch (err) {
      console.log(err);
      // throw new Error("Unable to Create Orders");
    }
  }
}

module.exports = ShoppingRepository;
