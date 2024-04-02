const express = require("express");
const {
  getAdmin,
  postAdmin,
  deleteAdmin,
} = require("../../controller/AdminController");
const routerAdmin = express.Router();

routerAdmin.get("/", getAdmin);
routerAdmin.post("/", postAdmin);
// routerAdmin.patch("/q", updateAdmin);
routerAdmin.delete("/q", deleteAdmin);
module.exports = routerAdmin;
