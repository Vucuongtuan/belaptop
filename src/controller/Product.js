const multer = require("multer");
const { ProductLaptop } = require("../models/");
const path = require("path");
const fs = require("fs");
const { createComment } = require("./likeAndComment");
const initRedis = require("../lib/init.redis");
const LIMIT = 10;

const getProduct = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;

    const cacheKey = `laptop${pageNumber ? `?page=${pageNumber}` : "?page="}${
      limit ? `&limit=${limit}` : "&limit="
    }`;
    const redisClient = initRedis.getRedis().product;
    await redisClient.get(cacheKey, async (err, cacheData) => {
      if (err) {
        console.error("Redis GET error:", err);
        return res.status(500).json({ message: "Redis error", error: err });
      }
      if (cacheData) {
        return res.json(JSON.parse(cacheData));
      } else {
        const totalDocuments = await ProductLaptop.countDocuments({});
        const totalPages = Math.ceil(totalDocuments / LIMIT);
        const getProduct = await ProductLaptop.find({})
          .skip((pageNumber - 1) * LIMIT)
          .limit(limit || LIMIT);

        if (getProduct.length === 0) {
          return res.status(404).json({
            message: "Không có sản phẩm nào!!!",
          });
        }

        await redisClient.setex(
          cacheKey,
          1800,
          JSON.stringify({
            total: getProduct.length,
            totalPage: totalPages,
            data: getProduct,
          })
        );
        return res.json({
          total: getProduct.length,
          totalPage: totalPages,
          data: getProduct,
        });
      }
    });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};

const getProductToBrand = async (req, res) => {
  try {
    const { id_brand, page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const getData = await ProductLaptop.find({ product_brand: id_brand })
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
const getProductTrend = async (req, res, next) => {
  try {
    const products = await ProductLaptop.find({})
      .sort({ totalPurchases: -1 })
      .limit(5);

    if (products.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào!!!",
      });
    }

    return res.json(products);
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};

const getByIdProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    const getProduct = await ProductLaptop.findOne({ _id: id });

    if (getProduct.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào!!!",
      });
    }
    return res.json(getProduct);
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/image/laptop");
  },
  filename: function (req, file, cb) {
    cb(null, "laptop" + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("thumbnail", 7);
const postProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const reqFile = req.files;
    const thumbnail = reqFile.map((item) => {
      const parts = item.originalname.split(".");
      const ext = parts[parts.length - 1];
      fs.renameSync(item.path, item.path + "." + ext);
      return process.env.BASE_URL + "/image/" + item.filename + "." + ext;
    });
    // const detailsJSON = JSON.stringify(data.details);
    // const detailsJSONParse = JSON.parse(data.details);
    const get = await ProductLaptop.findOne({ name: data.name });

    if (get === null) {
      const postProduct = await ProductLaptop.create({
        name: data.name,
        total: data.total,
        description: data.description,
        brands: data.brands,
        thumbnail: thumbnail,
        totalPurchases: data.totalPurchases,
        details: JSON.parse(data.details),
        discount_percent: data.discount_percent,
        inventory: data.inventory,
        product_category: data.product_category,
        product_brand: data.product_brand,
        // product_content: data.product_content,
      });
      await createComment(postProduct._id);
      return res.json({
        message: "Thêm mới laptop thành công.",
        data: postProduct,
      });
    } else {
      return res.json({
        message: "Đã có tên sp này",
        data: data.name,
      });
    }
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      error: err,
    });
  }
};

// const postProduct = async (req, res, next) => {
//   try {
//     const data = req.body.data;
//     console.log("====================================");
//     console.log(req.body);
//     console.log("====================================");
//     let thumbnails = [];
//     if (req.file) {
//       thumbnails = [
//         {
//           data: req.file.buffer,
//           contentType: req.file.mimetype,
//         },
//       ];
//     }
//     const postProduct = await ProductLaptop.create({
//       name: data.name,
//       brands: data.brands,
//       total: data.total,
//       description: data.description,
//       thumbnail: thumbnails,
//       totalPurchases: data.totalPurchases,
//       details: data.details,

//       discount_percent: data.discount_percent,
//       inventory: data.inventory,
//       product_category: data.product_category,
//       product_brand: data.product_brand,
//       product_content: data.product_content,
//     });
//     console.log("====================================");
//     console.log(postProduct);
//     console.log("====================================");
//     return res.json({
//       product: postProduct,
//       message: "Thêm mới sản phẩm thành công ",
//     });
//   } catch (err) {
//     console.log("====================================");
//     console.log(err);
//     console.log("====================================");
//     return res.json({
//       message: "Kết nối thất bại thử lại sau !!!",
//       error: err.toString(),
//     });
//   }
// };
const updateProduct = async (req, res, next) => {
  try {
    const id = req.query.id;
    const {
      name,
      total,
      description,
      thumbnail,
      totalPurchases,
      details,
      keyboard,
      audio,
      wifi_bluetooth,
      cam,
      system,
      weight,
      size,
      manufacturer,
      discount_percent,
      inventory,
      id_category,
      id_product_brand,
    } = req.body;
    const updateProduct = await ProductLaptop.findOneAndUpdate(id, {
      name,
      total,
      description,
      details,
      keyboard,
      audio,
      wifi_bluetooth,
      system,
      weight,
      size,
      manufacturer,
      discount_percent,
      inventory,
      product_category: id_category,
      product_brand: id_product_brand,
    });
    if (id === undefined) {
      return res.status(404).json({ message: "Không tìm thấy ID này" });
    }
    return res.json({
      data: updateProduct,
      message: "Sửa sản phẩm thành công ",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteProduct = await ProductLaptop.findByIdAndDelete(id);
    res.json({
      message: "Xóa sản phẩm thành công ",
      data: deleteProduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kết nối thất bại thử lại sau !!!",
    });
  }
};
const searchProduct = async (req, res, next) => {
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
    const products = await ProductLaptop.find(query);
    return res.json(products);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};
const selectProductPrice = async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const data = await ProductLaptop.find({ total: { $gte: min, $lte: max } });
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
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getByIdProduct,
  getProductTrend,
  getProductToBrand,
  selectProductPrice,
};
