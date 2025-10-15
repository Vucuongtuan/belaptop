const express = require("express");
const routerKeybourdType = express.Router();
const {
  getKeybourdType,
  postKeybourdType,
  updateKeybourdType,
  deleteKeybourdType,
} = require("../../controller/KeybourdTypeController");

routerKeybourdType.get("/", getKeybourdType);
routerKeybourdType.post("/", postKeybourdType);
routerKeybourdType.put("/id", updateKeybourdType);
routerKeybourdType.delete("/id", deleteKeybourdType);

module.exports = routerKeybourdType;
