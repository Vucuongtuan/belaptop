const express = require("express");
const {
  getAdmin,
  postAdmin,
  deleteAdmin,
  getbyIDAdmin,
  getonLineAdmin,
  loginAdmin,
} = require("../../controller/AdminController");
const routerAdmin = express.Router();

routerAdmin.get("/", getAdmin);
routerAdmin.post("/", postAdmin);
routerAdmin.post("/login", loginAdmin);
routerAdmin.get("/online", getonLineAdmin);
// routerAdmin.patch("/q", updateAdmin);
routerAdmin.delete("/q", deleteAdmin);
routerAdmin.get("/q", getbyIDAdmin);
module.exports = routerAdmin;
