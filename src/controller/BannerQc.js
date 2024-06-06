const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { BannerQc } = require("../models/");
const initRedis = require("../lib/init.redis");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/image/banner");
  },
  filename: function (req, file, cb) {
    cb(null, "banner" + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("thumbnail");
const getBannerQc = async (req, res, next) => {
  try {
    const cacheKey = `banner`;
    const redisClient = initRedis.getRedis().product;
    await redisClient.get(cacheKey, async (err, cacheData) => {
      if (err) {
        console.error("Redis GET error:", err);
        return res.status(500).json({ message: "Redis error", error: err });
      }
      if (cacheData) {
        return res.json(JSON.parse(cacheData));
      } else {
        let getData = await BannerQc.find({});
        if (getData.length === 0) {
          return res.json({
            message: "Không có dữ liệu nào ",
          });
        }
        await redisClient.setex(cacheKey, 1000, JSON.stringify(getData));
        return res.json(getData);
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      err: err,
    });
  }
};
const getBannerQcLimit = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    let getData = await BannerQc.find({}).limit(limit);

    if (getData.length === 0) {
      return res.json({
        message: "Không có dữ liệu nào ",
      });
    }
    return res.json({
      total: getData.length,
      data: getData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      err: err,
    });
  }
};

const postBannerQc = async (req, res, next) => {
  try {
    const { description, id } = req.body;
    const { filename, originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    fs.renameSync(path, path + "." + ext);
    if (!filename) {
      return res.status(400).json({
        message: "Thiếu hình ảnh.",
      });
    }

    const createData = await BannerQc.create({
      id: id,
      thumbnail: process.env.BASE_URL + "/image/" + filename + ".webp",
      description,
    });

    return res.json({
      message: "Thêm mới banner thành công.",
      data: createData,
      thumbnail: req.file,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      error: err,
    });
  }
};
const updateBannerQc = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const { description } = req.body;
    let thumbnailPath = null;
    if (req.file) {
      thumbnailPath = req.file.path;

      const oldData = await BannerQc.findById(_id);
      if (oldData && oldData.thumbnail) {
        fs.unlinkSync(oldData.thumbnail);
      }
    }
    const updatedData = await BannerQc.findByIdAndUpdate(
      _id,
      {
        thumbnail: thumbnailPath,
        description,
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu để cập nhật.",
      });
    }

    return res.json({
      message: "Cập nhật banner thành công.",
      data: updatedData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      error: err,
    });
  }
};
const deleteBannerQc = async (req, res, next) => {
  try {
    const { id } = req.query;
    let deleteBanner = await BannerQc.findByIdAndDelete({ _id: id });

    if (deleteBanner.length === 0) {
      res.json({
        message: "Dữ liệu không tồn tại",
      });
    }
    res.json({ message: "Xóa banner thành công", data: deleteBanner });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({
      message: "Lỗi kết nối đến server !!!",
      err: err,
    });
  }
};

module.exports = {
  getBannerQc,
  postBannerQc,
  updateBannerQc,
  deleteBannerQc,
  getBannerQcLimit,
};
