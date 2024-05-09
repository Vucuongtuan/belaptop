const express = require("express");
const {
  getAllBlog,
  getBlogById,
  createBlog,
  getBlogByName,
  getBlogByIdProduct,
} = require("../../controller/blogController");
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });
const routerBlog = express.Router();
routerBlog.get("/all", getAllBlog);
routerBlog.post("/query", getBlogByName);
routerBlog.post("/query", getBlogById);
routerBlog.post("/create", upload.single("thumbnail"), createBlog);
routerBlog.post("/product", getBlogByIdProduct);

module.exports = routerBlog;
