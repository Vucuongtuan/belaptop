const { ProductLaptop, Mouse, Keybourd, Revenue } = require("../models/");

const PAGE_SIZE = 10;

const getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const id = req.query.id;

    const [getDataLaptop, getDataMouse, getDataKeyboard] = await Promise.all([
      ProductLaptop.find({}),
      Mouse.find({}),
      Keybourd.find({}),
    ]);
    const allData = [...getDataLaptop, ...getDataMouse, ...getDataKeyboard];

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
      totalPage: Math.ceil(filteredData.length / PAGE_SIZE),
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
const getRevenue = async (req, res) => {
  try {
    const [getDataLaptop, getDataMouse, getDataKeyboard, revenueDoc] =
      await Promise.all([
        ProductLaptop.find({}),
        Mouse.find({}),
        Keybourd.find({}),
        Revenue.find({}),
      ]);
    const allData = [...getDataLaptop, ...getDataMouse, ...getDataKeyboard];
    let totalRevenue = 0;
    const products = allData.map((product) => {
      const revenue = product.total * product.totalPurchases || 0;
      totalRevenue += revenue;

      return {
        _id: product._id,
        thumbnailUrl: product.thumbnail[0],
        name: product.name,
        revenue,
      };
    });

    let total = revenueDoc[0].total;
    if (totalRevenue !== revenueDoc[0].total[revenueDoc[0].total.length - 1]) {
      total.push(totalRevenue);
      await Revenue.updateMany({
        totalRevenue: total,
      });
    }

    res.json({ total, products });
  } catch (err) {
    console.error("Error calculating total revenue:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIdSiteMap = async (req, res) => {
  try {
    const getDataLaptop = await ProductLaptop.find({}, "_id");
    const getDataMouse = await Mouse.find({}, "_id");
    const getDataKeybourd = await Keybourd.find({}, "_id");

    const allData = [...getDataLaptop, ...getDataMouse, ...getDataKeybourd];

    if (allData.length === 0) {
      return res.json({
        message: "Không có dữ liệu",
      });
    }

    const responseData = {
      data: allData,
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
const getProductByName = async (req, res) => {
  try {
    const name = req.body.name;

    const [getDataLaptop, getDataMouse, getDataKeyboard] = await Promise.all([
      ProductLaptop.find({ name: { $regex: new RegExp(name, "i") } }),
      Mouse.find({ name: { $regex: new RegExp(name, "i") } }),
      Keybourd.find({ name: { $regex: new RegExp(name, "i") } }),
    ]);
    const allData = [...getDataLaptop, ...getDataMouse, ...getDataKeyboard];
    const searchQuery = allData.filter((data) => data.name === name);

    res.json(allData);
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");

    res.status(500).json({ message: "Lỗi hệ thống vui lòng thử lại sau" });
  }
};
module.exports = { getAllProduct, getIdSiteMap, getRevenue, getProductByName };
