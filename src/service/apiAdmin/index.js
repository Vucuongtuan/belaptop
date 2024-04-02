const express = require("express");
const {
  getAdmin,
  postAdmin,
  deleteAdmin,
  getbyIDAdmin,
} = require("../../controller/AdminController");
const routerAdmin = express.Router();

routerAdmin.get("/", getAdmin);
routerAdmin.post("/", postAdmin);
// routerAdmin.patch("/q", updateAdmin);
routerAdmin.delete("/q", deleteAdmin);
routerAdmin.delete("/q", getbyIDAdmin);
module.exports = routerAdmin;
