const express = require("express");
const getAllProduct = require("../../controller/AllProductController");
const routerAllProduct = express.Router();

routerAllProduct.get("/", getAllProduct);

module.exports = routerAllProduct;
