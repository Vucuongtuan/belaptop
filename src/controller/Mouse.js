const multer = require("multer");
const { Mouse } = require("../models/");

const LIMIT = 10;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/image/mouse");
  },
  filename: function (req, file, cb) {
    cb(null, "mouse" + "-" + originalname);
  },
});

const upload = multer({ storage: storage }).array("thumbnail", 7);
const getDataMouse = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const totalDocuments = await Mouse.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / LIMIT);
    const getData = await Mouse.find({})
      .skip((pageNumber - 1) * LIMIT)
      .limit(limit || LIMIT);
    if (getData.length <= 0) {
      return res.status(404).json({
        message: "Không có dữ liệu !!",
      });
    }
    return res.json({
      total: getData.length,
      totalPage: totalPages,
      data: getData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối vui lòng thử lại sau",
    });
  }
};
const getMouseToBrand = async (req, res) => {
  try {
    const { id_brand, page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const getData = await Mouse.find({ product_brand: id_brand })
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
const getDataById = async () => {
  try {
    const { id } = req.query;
    const getData = await Mouse.findOne({ _id: id });
    if (getData.length <= 0) {
      return res.status(404).json("Không có sản phẩm nào !!!");
    }
    return res.json(getData);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối vui lòng thử lại sau",
    });
  }
};
const postDataMouse = async (req, res, next) => {
  try {
    upload.array("images")(req, res, async function (err) {
      if (err) {
        console.error("Error uploading images:", err.message);
        return res.status(500).send("Internal Server Error");
      }
      const {
        name,
        total,
        guarantee,
        details,
        description,
        totalPurchases,
        brands,
      } = req.body;
      const imagePaths = req.files
        ? req.files.map((file) => ({
            url: file.path.replace("assets", ""),
            isThumbnail: false,
          }))
        : [];

      const thumbnailIndex = req.body.thumbnailIndex;
      if (thumbnailIndex !== undefined && thumbnailIndex < imagePaths.length) {
        imagePaths[thumbnailIndex].isThumbnail = true;
      }

      const postData = await Mouse.create({
        name,
        total,
        guarantee,
        details,
        description,
        totalPurchases,
        brands,
        discount_percent,
        inventory,
        thumbnail: imagePaths,
      });

      return res.json(postData);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối vui lòng thử lại sau",
    });
  }
};
const updateDataMouse = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { name, total, guarantee, details } = req.body;
    const updateData = await Mouse.findByIdAndUpdate(id, {
      name,
      total,
      guarantee,
      details,
      thumbnail,
      discount_percent,
      inventory,
    });

    return res.json({
      message: "Đã sửa thành công !!!",
      data: updateData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối vui lòng thử lại sau",
    });
  }
};
const deleteDataMouse = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteData = await Mouse.findByIdAndDelete(id);
    if (deleteData.length === 0) {
      return res.status(404).json({
        message: "Không có dữ liệu !!",
      });
    }
    return res.json(deleteData);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối vui lòng thử lại sau",
    });
  }
};
const searchDataMouse = async (req, res, next) => {
  try {
    const { type, brand, minPrice, maxPrice } = req.query;
    const query = {};
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
    }
    const products = await Mouse.find(query);
    return res.json(products);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};
const selectMousePrice = async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const minPrice = parseInt(min);
    const maxPrice = parseInt(max);
    const data = await Mouse.find({
      total: { $gte: minPrice, $lte: maxPrice },
    });
    console.log(data);
    if (data.length <= 0) {
      return res.status(404).json("Không có sản phẩm nào");
    }
    return res.json({
      total: data.length,
      totalPage: Math.ceil(data.length / 10),
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};

module.exports = {
  getDataMouse,
  postDataMouse,
  updateDataMouse,
  deleteDataMouse,
  searchDataMouse,
  getDataById,
  getMouseToBrand,
  selectMousePrice,
};
