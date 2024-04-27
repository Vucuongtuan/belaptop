const express = require("express");
const {
  getCommentByProductID,
  createComment,
  insertComment,
  likeComment,
  replyComment,
} = require("../../controller/likeAndComment");
const routerComment = express.Router();

routerComment.post("/", getCommentByProductID);
routerComment.post("/create", createComment);
routerComment.post("/insert", insertComment);
routerComment.post("/:commentId/likes", likeComment);
routerComment.post("/:commentId/reply", replyComment);

module.exports = routerComment;
