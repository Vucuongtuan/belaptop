const express = require("express");
const routerProductType = express.Router();
const {
  getProductType,
  postProductType,
  putProductType,
  deleteProductType,
} = require("../../controller/ProductTypeController");
const {
  checkProductType,
  checkProductTypeID,
} = require("../../middleware/checkProductType");

routerProductType.get("/", getProductType);
routerProductType.post("/", postProductType);
routerProductType.put("/update_id", putProductType);
routerProductType.delete("/delete_id", deleteProductType);

module.exports = routerProductType;
