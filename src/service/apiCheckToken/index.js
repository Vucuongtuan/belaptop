const express = require("express");
const { checkTokenAdmin } = require("../../controller/TokenCheck");
const routerToken = express.Router();

routerToken.post("/", checkTokenAdmin);
module.exports = routerToken;
