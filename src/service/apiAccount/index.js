const express = require("express");
const accountAPI = express.Router();
const {
  checkAccountUser,
  checkAccountID,
} = require("../../middleware/checkAccountUser");
const {
  getDataAccountUser,
  getDataByIDAccountUser,
  postDataAccountUser,
  putDataAccountUser,
  deleteAccountUser,
  loginAccountApp,
  sendOTPToEmailMiddleware,
  sendOTP,
} = require("../../controller/AccountController");
const verifyOTP = require("../../middleware/checkOTP");

accountAPI.get("/", getDataAccountUser);
accountAPI.post("/query", getDataByIDAccountUser);
accountAPI.post("/send-otp", sendOTPToEmailMiddleware);
accountAPI.post("/", verifyOTP, postDataAccountUser);
accountAPI.put("/update_id", putDataAccountUser);
accountAPI.delete("/delete_id", deleteAccountUser);

accountAPI.post("/login", loginAccountApp);

module.exports = accountAPI;
