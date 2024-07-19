const { APIError, STATUS_CODES } = require("../../utlis/app-errors");
const { CustomerModel, AddressModel } = require("../models");

class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = await CustomerModel.create({
        email,
        password,
        salt,
        phone,
        address: [],
      });
      return customer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);
      if (profile) {
        const newAddress = await AddressModel.create({
          street,
          postalCode,
          city,
          country,
        });

        profile.address.push(newAddress);
      }

      return await profile.save();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingUser = await CustomerModel.findOne({ email: email });
      return existingUser;
    } catch (err) {
      console.log(err);
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingUser = await CustomerModel.findById(id).populate("address");
      console.log(existingUser);
      return existingUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async Wishlist(customerId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );
      return profile.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Wishlist "
      );
    }
  }

  async AddWhislistItem(
    customerId,
    { _id, name, desc, price, available, banner }
  ) {
    try {
      const product = { _id, name, desc, price, available, banner };
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );
      if (profile) {
        let wishlist = profile.wishlist;
        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });
          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }
        profile.wishlist = wishlist;
      }
      const profileResult = await profile.save();
      return profileResult.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Add to WishList"
      );
    }
  }
  async AddItemCart(customerId, { _id, name, price, banner }, qty, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart");
      if (profile) {
        const cartItem = {
          product: { _id, name, price, banner },
          unit: qty,
        };

        let cartItems = profile.cart;
        if (cartItem.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (
              item.product._id.toString() === cartItem.product._id.toString()
            ) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;
        const cartSaveResult = await profile.save();
        return cartSaveResult;
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId);
      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);
        const profileResult = await profile.save();
        return profileResult;
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }
}

module.exports = CustomerRepository;
