const express = require("express");
const routerQcBanner = express.Router();
const {
  getBannerQc,
  postBannerQc,
  updateBannerQc,
  deleteBannerQc,
  getBannerQcLimit,
} = require("../../controller/BannerQc");
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });

routerQcBanner.get("/", getBannerQc);
routerQcBanner.get("/query", getBannerQcLimit);
routerQcBanner.post("/", upload.single("thumbnail"), postBannerQc);
routerQcBanner.put("/", updateBannerQc);
routerQcBanner.delete("/", deleteBannerQc);

module.exports = routerQcBanner;
