const express = require("express");
const { viewCart, addToCart } = require("../../controller/Cart");

const routerCart = express.Router();

routerCart.get("/", viewCart);
routerCart.post("/", addToCart);
module.exports = routerCart;
