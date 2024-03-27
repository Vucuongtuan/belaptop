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
accountAPI.get("/query", getDataByIDAccountUser);
accountAPI.post("/send-otp", sendOTPToEmailMiddleware);
accountAPI.post("/", verifyOTP, postDataAccountUser);
accountAPI.put("/update_id", putDataAccountUser);
accountAPI.delete("/delete_id", deleteAccountUser);

accountAPI.post("/signin", loginAccountApp);

module.exports = accountAPI;
