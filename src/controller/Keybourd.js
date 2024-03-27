const { Keybourd } = require("../models/");
const multer = require("multer");
const path = require("path");
const messageError = (err) => {
  return res.status(500).json({
    message: "Kết nối thất bai !!!",
    err: err,
  });
};
const LIMIT = 10;
const getKeybourd = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const totalDocuments = await Keybourd.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / LIMIT);
    const getData = await Keybourd.find({})
      .skip((pageNumber - 1) * LIMIT)
      .limit(limit || LIMIT);
    if (getData.length <= 0) {
      return res.status(404).json("Không có dữ liệu");
    }
    return res.json({
      total: getData.length,
      totalPage: totalPages,
      data: getData,
    });
  } catch (err) {
    return messageError(err);
  }
};
const getKeyboardToBrand = async (req, res) => {
  try {
    const { id_brand, page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const getData = await Keybourd.find({ product_brand: id_brand })
      .skip((pageNumber - 1) * LIMIT)
      .limit(limit || LIMIT);

    if (getData.length <= 0) {
      return res
        .status(404)
        .json({ message: "Không có sản phẩm nào", status: 404 });
    }
    return res.json({
      total: getData.length,
      totalPage: Math.ceil(getData.length / LIMIT),
      data: getData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};
const getKeybourdById = async (req, res, next) => {
  try {
    const { id } = req.query;
    const getData = await Keybourd.findOne({ _id: id });
    if (getData.length <= 0) {
      return res.status(404).json("Không có sản phẩm nào");
    }
    return res.json(getData);
  } catch (err) {
    return messageError(err);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/image/keyboard");
  },
  filename: function (req, file, cb) {
    cb(null, "keyboard" + "-" + originalname);
  },
});

const upload = multer({ storage: storage }).array("thumbnail", 7);
const postKeybourd = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          message: "Lỗi khi upload hình ảnh",
          error: err,
        });
      }

      const {
        name,
        layout,
        brands,
        description,
        totalPurchases,
        switch_key,
        pin,
        personal,
        foam,
        weight,
        size,
        connector,
        configuration,
        keycap,
        support,
        accessory,
        software,
        compatibility,
        product_type_keybourd,
        product_content,
        product_brand,
        discount_percent,
        inventory,
      } = req.body;

      const thumbnails = req.files.map((file) => ({
        type: file.mimetype,
        path: `https://vtc-be-laptop.onrender.com/assets/images/keyboard/${file.filename}`,
      }));

      const postData = await Keybourd.create({
        name,
        brands,
        thumbnail: thumbnails,
        layout,
        description,
        totalPurchases,
        switch_key,
        pin,
        personal,
        foam,
        weight,
        size,
        connector,
        configuration,
        keycap,
        support,
        accessory,
        software,
        compatibility,
        product_type_keybourd,
        product_content,
        product_brand,
        discount_percent,
        inventory,
      });

      if (!postData) {
        return res
          .status(500)
          .json({ message: "Thêm thất bại, tên name đã tồn tại" });
      }

      return res.json({ message: "Thêm mới thành công", data: postData });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Kết nối thất bại thử lại sau !!!", error: err });
  }
};

const updateKeybourd = async (req, res, next) => {
  try {
    const id = req.query.id;
    const {
      name,
      thumbnail,
      description,
      totalPurchases,
      layout,
      switch_key,
      pin,
      personal,
      foam,
      weight,
      size,
      connector,
      configuration,
      keycap,
      support,
      accessory,
      software,
      compatibility,
      product_type_keybourd,
      product_brand,
      discount_percent,
      inventory,
    } = req.body;
    await Keybourd.findByIdAndUpdate(id, {
      name,
      thumbnail,
      layout,
      switch_key,
      description,
      totalPurchases,
      pin,
      personal,
      foam,
      weight,
      size,
      connector,
      configuration,
      keycap,
      support,
      accessory,
      software,
      compatibility,
      product_type_keybourd,
      product_brand,
      discount_percent,
      inventory,
      update_date: { type: Date, default: Date.now() },
    })
      .then((data) => {
        return res.json({
          message: "Sửa thành công",
          data: data,
        });
      })
      .catch((err) => {
        return res.json("Sửa thất bại");
      });
  } catch (err) {
    return messageError(err);
  }
};
const deleteKeybourd = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteData = await Keybourd.findByIdAndDelete(id);
    if (deleteData.length === 0) {
      return res.status(404).json({
        message: "Không có dữ liệu !!",
      });
    }
    return res.json({
      message: "Xóa  thành công",
      data: deleteData,
    });
  } catch (error) {
    return messageError(error);
  }
};
const selectKeyboardPrice = async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const data = await Keybourd.find({ total: { $gte: min, $lte: max } });
    if (data.length <= 0) {
      return res.status(404).json("Khong có sản phẩm nào");
    }
    return res.json({
      total: data.lenght,
      totalPage: data.length / 10,
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};
module.exports = {
  getKeybourd,
  postKeybourd,
  updateKeybourd,
  deleteKeybourd,
  getKeybourdById,
  getKeyboardToBrand,
  selectKeyboardPrice,
};
