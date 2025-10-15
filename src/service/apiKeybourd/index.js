const express = require("express");
const routerKeybourd = express.Router();
const {
  getKeybourd,
  postKeybourd,
  updateKeybourd,
  deleteKeybourd,
  getKeybourdById,
  getKeyboardToBrand,
  selectKeyboardPrice,
} = require("../../controller/Keybourd");
const multer = require("multer");
const upload = multer({ dest: "src/assets/image" });
routerKeybourd.get("/", getKeybourd);
routerKeybourd.get("/query", getKeybourdById);
routerKeybourd.get("/brand", getKeyboardToBrand);
routerKeybourd.post("/",upload.array("thumbnail"), postKeybourd);
routerKeybourd.put("/id", updateKeybourd);
routerKeybourd.delete("/id", deleteKeybourd);
routerKeybourd.get("/", selectKeyboardPrice);

module.exports = routerKeybourd;
