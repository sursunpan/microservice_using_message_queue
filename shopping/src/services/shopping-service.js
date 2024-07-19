const { ShoppingRepository } = require("../database");
const { APIError } = require("../utlis/app-errors");
const { FormateData } = require("../utlis/index");

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;
    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data not Found");
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data not Found");
    }
  }

  async GetOrderDetails(orderId) {
    try {
      const order = await this.repository.OrderById(orderId);
      return FormateData(order);
    } catch (err) {
      throw err;
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      console.log("customerId--------------", customerId);
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw err;
    }
  }

  async SubcribeEvents(payload) {
    console.log("payload=============", payload);
    const parsedData = JSON.parse(payload);
    const { event, data } = parsedData;
    console.log("data---------------->", event);
    const { userId, product, qty } = data;
    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };
      return FormateData(payload);
    } else {
      return FormateData({ error: "No Order is Available" });
    }
  }
}

module.exports = ShoppingService;
