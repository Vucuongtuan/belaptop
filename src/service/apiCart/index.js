const express = require("express");
const {
  viewCart,
  addToCart,
  getAllHoaDon,
  getHoaDonByUser,
  updateHoaDonByUser,
} = require("../../controller/Cart");
const updateProduct = require("../../middleware/updateProduct");

const routerCart = express.Router();

routerCart.get("/", viewCart);
routerCart.get("/all", getAllHoaDon);
routerCart.post("/", getHoaDonByUser);
routerCart.post("/add", updateProduct, addToCart);
routerCart.put("/update", updateHoaDonByUser);
module.exports = routerCart;
