const express = require("express");
const {
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getByIdProduct,
  getProductTrend,
  getProductToBrand,
  selectProductPrice,
} = require("../../controller/Product");
const { checkProduct } = require("../../middleware/checkProduct");
const routerProduct = express.Router();

routerProduct.get("/", getProduct);
routerProduct.get("/brand", getProductToBrand);
routerProduct.get("/query", getByIdProduct);
routerProduct.get("/trend", getProductTrend);
routerProduct.post("/", postProduct);
routerProduct.put("/", updateProduct);
routerProduct.delete("/", deleteProduct);
routerProduct.delete("/search", searchProduct);
routerProduct.post("/price", selectProductPrice);

module.exports = routerProduct;
