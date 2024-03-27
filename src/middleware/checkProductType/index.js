const { ProductCategory } = require("../../models/");
const checkProductType = async (req, res, next) => {
  try {
    const nameProductType = req.body.nameProductType;
    const check = await ProductCategory.find({
      name_product_category: nameProductType,
    });
    console.log("====================================");
    console.log(check);
    console.log("====================================");
    if (check.length === 0) {
      return next();
    }
    return res.status(500).json({
      message: "Đã có loại sản phẩm này rồi !! ",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối,vui lòng thử lại sau !!c",
      err: err,
    });
  }
};
const checkProductTypeID = async (req, res, next) => {
  try {
    const _id = req.query.id;
    const check = await ProductCategory.findById(_id);
    if (check.length === 0) {
      next();
    } else {
      res.status(500).json({
        message: `Đã có loại sản phẩm có ID : ${_id} này rồi`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Lỗi kết nối,vui lòng thử lại sau !!",
    });
  }
};
module.exports = { checkProductType, checkProductTypeID };
