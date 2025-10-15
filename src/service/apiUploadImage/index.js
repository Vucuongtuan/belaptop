const express = require("express");
const upload = require("../../middleware/uploadImage");

const routerUpload = express.Router();
let uploadedImages = [];
routerUpload.post("/", upload.array("image"), (req, res) => {
  try {
    req.files.forEach((file) => {
      uploadedImages.push(file.path);
    });

    res.json(uploadedImages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = routerUpload;
