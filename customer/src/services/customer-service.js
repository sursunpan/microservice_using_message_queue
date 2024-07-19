const { CustomerRepository } = require("../database");
const {
  ValidatePassword,
  GenerateSignature,
  FormateData,
  GenerateSalt,
  GeneratePassword,
} = require("../utlis");
const { APIError } = require("../utlis/app-errors");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingCustomer = await this.repository.FindCustomer({ email });
      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );
        console.log("validatePassword", validPassword);

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({ id: existingCustomer._id, token });
        }

        return FormateData(null);
      }
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;
    try {
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);
      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });
      const token = await GenerateSignature({
        email: email,
        _id: customer._id,
      });
      return FormateData({ id: customer._id, token });
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;
    try {
      const addressResult = await this.repository.CreateAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async GetProfile(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async GetShoppingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async GetWishList(customerId) {
    try {
      const wishListResult = await this.repository.Wishlist(customerId);
      return FormateData(wishListResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async AddToWishList(customerId, product) {
    try {
      const wishListResult = await this.repository.AddWhislistItem(
        customerId,
        product
      );
      return FormateData(wishListResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async ManageCart(customerId, product, qty, isRemove) {
    try {
      console.log("customeriD", customerId);
      const cartResult = await this.repository.AddItemCart(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async ManageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async SubscribeEvents(payload) {
    const parsedData = JSON.parse(payload);
    const { event, data } = parsedData;
    const { userId, product, order, qty } = data;
    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishList(userId, product);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;
