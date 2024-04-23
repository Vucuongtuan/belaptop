const express = require("express");
const {
  getAllBlog,
  getBlogById,
  createBlog,
  getBlogByName,
} = require("../../controller/blogController");
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });
const routerBlog = express.Router();
routerBlog.get("/all", getAllBlog);
routerBlog.get("/query", getBlogByName);
routerBlog.get("/query", getBlogById);
routerBlog.post("/create", upload.single("thumbnail"), createBlog);

module.exports = routerBlog;
