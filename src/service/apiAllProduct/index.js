const express = require("express");
const {
  getAllProduct,
  getIdSiteMap,
  getRevenue,
} = require("../../controller/AllProductController");
const routerAllProduct = express.Router();

routerAllProduct.get("/", getAllProduct);
routerAllProduct.get("/total-revenue", getRevenue);
routerAllProduct.get("/allID", getIdSiteMap);

module.exports = routerAllProduct;
