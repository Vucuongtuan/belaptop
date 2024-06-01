const express = require("express");
const { getInvoices } = require("../../controller/invoicesController");

const invoicesRouter = express.Router();

invoicesRouter.post("/", getInvoices);

module.exports = invoicesRouter;
