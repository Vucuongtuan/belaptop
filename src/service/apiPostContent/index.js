const express = require("express");
const routerPost = express.Router();
const {
  getAllPostContents,
  getPostContentById,
  createPostContent,
  updatePostContentById,
  deletePostContentById,
} = require("../../controller/PostController");
routerPost.get("/", getAllPostContents);
routerPost.get("/getById", getPostContentById);
routerPost.post("/", createPostContent);
routerPost.put("/update", updatePostContentById);
routerPost.delete("/delete", deletePostContentById);

module.exports = routerPost;
