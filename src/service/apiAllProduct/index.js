const express = require("express");
const {
  getAllProduct,
  getIdSiteMap,
  getRevenue,
  getProductByName,
} = require("../../controller/AllProductController");
const routerAllProduct = express.Router();

routerAllProduct.get("/", getAllProduct);
routerAllProduct.get("/total-revenue", getRevenue);
routerAllProduct.get("/allID", getIdSiteMap);
routerAllProduct.post("/search", getProductByName);

module.exports = routerAllProduct;
