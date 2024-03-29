const express = require("express");
const {
  getAllProduct,
  getIdSiteMap,
} = require("../../controller/AllProductController");
const routerAllProduct = express.Router();

routerAllProduct.get("/", getAllProduct);
routerAllProduct.get("/allID", getIdSiteMap);

module.exports = routerAllProduct;
