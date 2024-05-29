const express = require("express");
const {
  viewCart,
  addToCart,
  getAllHoaDon,
  getHoaDonByUser,
  updateHoaDonByUser,
} = require("../../controller/Cart");

const routerCart = express.Router();

routerCart.get("/", viewCart);
routerCart.get("/all", getAllHoaDon);
routerCart.post("/", getHoaDonByUser);
routerCart.post("/", addToCart);
routerCart.post("/update", updateHoaDonByUser);
module.exports = routerCart;
