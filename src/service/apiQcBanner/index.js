const express = require("express");
const routerQcBanner = express.Router();
const {
  getBannerQc,
  postBannerQc,
  updateBannerQc,
  deleteBannerQc,
  getBannerQcLimit,
} = require("../../controller/BannerQc");

routerQcBanner.get("/", getBannerQc);
routerQcBanner.get("/query", getBannerQcLimit);
routerQcBanner.post("/", postBannerQc);
routerQcBanner.put("/", updateBannerQc);
routerQcBanner.delete("/", deleteBannerQc);

module.exports = routerQcBanner;
