const express = require("express");
const {
  getDataMouse,
  postDataMouse,
  updateDataMouse,
  deleteDataMouse,
  searchDataMouse,
  getDataById,
  getMouseToBrand,
  selectMousePrice,
} = require("../../controller/Mouse");
const routerMouse = express.Router();

routerMouse.get("/", getDataMouse);
routerMouse.get("/query", getDataById);
routerMouse.get("/brand", getMouseToBrand);
routerMouse.post("/", postDataMouse);
routerMouse.put("/update_id", updateDataMouse);
routerMouse.delete("/delete_id", deleteDataMouse);
routerMouse.get("/search", searchDataMouse);
routerMouse.post("/price", selectMousePrice);

module.exports = routerMouse;
