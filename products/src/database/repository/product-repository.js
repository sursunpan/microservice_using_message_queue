const { APIError, STATUS_CODES } = require("../../utlis/app-errors");
const { ProductModel } = require("../models");

class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    try {
      const product = ProductModel.create({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return product;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Product"
      );
    }
  }

  async Products() {
    try {
      return await ProductModel.find();
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Products"
      );
    }
  }

  async FindById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Product"
      );
    }
  }

  async FindByCategory(category) {
    try {
      const products = await ProductModel.find({ type: category });
      return products;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Category"
      );
    }
  }

  async FindSelectedProducts(selectedId) {
    try {
      const products = await ProductModel.find()
        .where("_id")
        .in(selectedId.map((_id) => _id))
        .exec();

      return products;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find Product"
      );
    }
  }
}

module.exports = ProductRepository;
