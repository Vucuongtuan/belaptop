const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/image");
  },
  filename: function (req, file, cb) {
    cb(null, "product" + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
// function uploadMiddleware(req, res, next) {
//   try {
//     upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         return res.status(500).json({ message: "Lỗi khi upload file." });
//       } else if (err) {
//         return res.status(500).json({ message: "Đã xảy ra lỗi." });
//       }

//       const uploadedFiles = req.files.map((file) => file.filename);
//       res.json({
//         message: "Upload thumbnails thành công",
//         data: uploadedFiles,
//       });
//     });
//   } catch (err) {
//     console.log("====================================");
//     console.log(err);
//     console.log("====================================");
//     res.json(err);
//   }
// }

// module.exports = uploadMiddleware;
