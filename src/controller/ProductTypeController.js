const { ProductTypeLaptop } = require("../models/");

const getProductType = async (req, res, next) => {
  try {
    const data = await ProductTypeLaptop.find({});
    if (data.length === 0) {
      return res.status(404).json({
        message: "Không có loại sản phẩm nào !!!",
      });
    }
    return res.json(data);
  } catch (err) {
    return res.json({
      message: "Lỗi kết nối với database",
      err: err,
    });
  }
};
const postProductType = async (req, res, next) => {
  try {
    const name_product_type = req.body.nameProductType;
    const description = req.body.description;
    const dataPort = await ProductTypeLaptop.create({
      name_product_type: name_product_type,
      description: description,
    });
    return res.json({
      message: "Thêm mới loại sản phẩm thành công ",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối với database",
    });
  }
};
const putProductType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const nameProductType = req.body.nameProductType;
    const description = req.body.description;
    const dataUpdate = await ProductTypeLaptop.findByIdAndUpdate(id, {
      name_product_category: nameProductType,
      description: description,
      update_data: Date.now,
    });
    return res.json({
      message: "Cập nhật dữ liệu thành công",
      data: dataUpdate,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối với database",
    });
  }
};
const deleteProductType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteProductById = await ProductTypeLaptop.findByIdAndDelete(id);
    if (deleteProductById === 0) {
      return res.status(404).json({
        message: "Không có loại sản phẩm có ID là : " + id,
      });
    }
    return res.json({
      message: "Xóa loại sản phẩm thành công",
      data: deleteProductById,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối với database",
    });
  }
};

module.exports = {
  getProductType,
  postProductType,
  putProductType,
  deleteProductType,
};
