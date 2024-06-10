const express = require("express");
const {
  getAllBlog,
  getBlogById,
  createBlog,
  getBlogByName,
  getBlogByIdProduct,
  getNewBlog,
  updateBlog,
} = require("../../controller/blogController");
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });
const routerBlog = express.Router();
routerBlog.post("/create", upload.single("thumbnail"), createBlog);
routerBlog.get("/all", getAllBlog);
routerBlog.get("/new", getNewBlog);
routerBlog.post("/name", getBlogByName);
routerBlog.post("/:id", getBlogById);
routerBlog.post("/product/:id", getBlogByIdProduct);
routerBlog.put("/update/:id", updateBlog);

module.exports = routerBlog;
