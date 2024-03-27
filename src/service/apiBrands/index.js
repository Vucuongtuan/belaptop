const express = require("express");
const {
  getBrands,
  postBrands,
  updateBrands,
  deleteBrands,
  getBrandsType,
} = require("../../controller/BrandsController");
const routerBrands = express.Router();

routerBrands.get("/", getBrands);
routerBrands.post("/type", getBrandsType);
routerBrands.post("/", postBrands);
routerBrands.put("/id", updateBrands);
routerBrands.delete("/id", deleteBrands);

module.exports = routerBrands;
