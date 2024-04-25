const express = require("express");
const {
  getCommentByProductID,
  createComment,
  insertComment,
} = require("../../controller/likeAndComment");
const routerComment = express.Router();

routerComment.post("/", getCommentByProductID);
routerComment.post("/create", createComment);
routerComment.post("/insert", insertComment);

module.exports = routerComment;
