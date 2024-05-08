const express = require("express");
const { viewCart, addToCart } = require("../../controller/Cart");
const {
  createInvoiceAndSendEmail,
} = require("../../middleware/invoice/createInvoice");

const routerCart = express.Router();

routerCart.get("/", viewCart);
routerCart.post("/", createInvoiceAndSendEmail, addToCart);
module.exports = routerCart;
