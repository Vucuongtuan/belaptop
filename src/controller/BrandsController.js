const { query } = require("express");
const { Brands } = require("../models/");
const multer = require("multer");

const message = (err) => {
  return res.status(500).json({
    message: "Lôi kết nối với Server",
    error: err,
  });
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/assets/brands/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage: storage }).single("thumbnail");
const getBrands = async (req, res, next) => {
  try {
    const getData = await Brands.find({});
    if (getData.length <= 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm nào",
      });
    }
    return res.json(getData);
  } catch (err) {
    return message(err);
  }
};
const getBrandsType = async (req, res, next) => {
  try {
    const { type } = req.body;
    const getData = await Brands.find({
      type: { $regex: new RegExp(type, "i") },
    });
    if (getData.length <= 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm nào",
      });
    }
    return res.json(getData);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi không xác định",
      error: err.message,
    });
  }
};

const postBrands = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          message: "Lỗi khi tải lên hình ảnh",
          error: err.message,
        });
      } else if (err) {
        return res.status(500).json({
          message: "Lỗi khi tải lên hình ảnh",
          error: err.message,
        });
      }
      const { name, description } = req.body;
      const thumbnail = req.file ? req.file.filename : null;
      const postData = await Brands.create({
        name,
        description,
        thumbnail,
      });

      if (postData) {
        return res.json({
          message: "Thêm mới brands thành công ",
          data: postData,
        });
      } else {
        return res.status(500).json({
          message: "Thêm mới brands thất bại",
        });
      }
    });
  } catch (err) {
    return message(err);
  }
};
const updateBrands = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { name, description } = req.body;

    const updateData = await Brands.findByIdAndUpdate(id, {
      name,
      description,
    });
    if (updateData) {
      return res.json({
        message: "Sửa brands thành công",
      });
    } else {
      return res.status(500).json({
        message: "Sửa brands thất bại",
      });
    }
  } catch (err) {
    return message(err);
  }
};
const deleteBrands = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteData = await Brands.findByIdAndDelete(id);
    if (deleteData.length === 0) {
      return res.status(404).json({
        message: "Không có dữ liệu !!",
      });
    }
    return res.json({
      message: "Xóa Brands thành công",
      data: deleteData,
    });
  } catch (err) {
    return message(err);
  }
};
module.exports = {
  getBrands,
  postBrands,
  updateBrands,
  deleteBrands,
  getBrandsType,
};
