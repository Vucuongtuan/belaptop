const { ProductLaptop, Mouse, Keybourd } = require("../models/");

const PAGE_SIZE = 10;

const getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const id = req.query.id;

    const getDataLaptop = await ProductLaptop.find({});
    const getDataMouse = await Mouse.find({});
    const getDataKeybourd = await Keybourd.find({});

    const allData = [...getDataLaptop, ...getDataMouse, ...getDataKeybourd];

    const filteredData = !id
      ? allData
      : allData.filter((item) => {
          return item._id.toString() === id;
        });

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const newData = filteredData.slice(startIndex, endIndex);

    if (newData.length === 0) {
      return res.json({
        message: "Không có dữ liệu",
      });
    }

    const responseData = {
      total: filteredData.length,
      totalPages: Math.ceil(filteredData.length / PAGE_SIZE),
      data: newData,
    };

    return res.json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Lỗi kết nối với Server",
      error: err,
    });
  }
};

module.exports = getAllProduct;
