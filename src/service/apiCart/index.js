const express = require("express");
const {
  viewCart,
  addToCart,
  getAllHoaDon,
  getHoaDonByUser,
} = require("../../controller/Cart");

const routerCart = express.Router();

routerCart.get("/", viewCart);
routerCart.get("/all", getAllHoaDon);
routerCart.post("/", getHoaDonByUser);
routerCart.post("/", addToCart);
module.exports = routerCart;
