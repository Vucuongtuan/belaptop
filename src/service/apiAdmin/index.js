const express = require("express");
const {
  getAdmin,
  postAdmin,
  deleteAdmin,
  getbyIDAdmin,
  getonLineAdmin,
  loginAdmin,
  logoutOnLineAdmin,
  getProfileByID,
  updateAdmin,
} = require("../../controller/AdminController");
const routerAdmin = express.Router();

routerAdmin.get("/", getAdmin);
routerAdmin.post("/", postAdmin);
routerAdmin.post("/login", loginAdmin);
routerAdmin.get("/online", getonLineAdmin);
routerAdmin.post("/online/logout", logoutOnLineAdmin);
routerAdmin.post("/q", getProfileByID);
routerAdmin.put("/update", updateAdmin);
routerAdmin.delete("/q", deleteAdmin);
routerAdmin.get("/q", getbyIDAdmin);
module.exports = routerAdmin;
