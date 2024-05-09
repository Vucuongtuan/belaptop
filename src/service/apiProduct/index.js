const express = require("express");
const {
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getByIdProduct,
  getProductTrend,
  getProductToBrand,
  selectProductPrice,
} = require("../../controller/Product");
const { checkProduct } = require("../../middleware/checkProduct");
const uploadMiddleware = require("../../middleware/uploadImage");
const routerProduct = express.Router();
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });

routerProduct.get("/", getProduct);
routerProduct.get("/brand", getProductToBrand);
routerProduct.get("/query", getByIdProduct);
routerProduct.get("/trend", getProductTrend);
routerProduct.post("/", upload.array("thumbnail"), postProduct);
routerProduct.put("/id", updateProduct);
routerProduct.delete("/id", deleteProduct);
routerProduct.post("/search", searchProduct);
routerProduct.post("/price", selectProductPrice);

module.exports = routerProduct;
