const { KeybourdType } = require("../models/");

const messageError = (err) => {
  return res.status(500).json({
    message: "Kết nối thất bai !!!",
    err: err,
  });
};
const getKeybourdType = async (req, res, next) => {
  try {
    const getData = await KeybourdType.find({});
    if (getData.length <= 0) {
      return res.status(404).json("Không có dữ liệu");
    }
    return res.json(getData);
  } catch (err) {
    return messageError(err);
  }
};

const postKeybourdType = async (req, res, next) => {
  try {
    const { name_type, description, id } = req.body;
    const postData = await KeybourdType.create({
      name_type: name_type,
      description: description,
      product_brand: id,
    });
    if (postData.length <= 0) {
      return res.status(500).json("Thêm thất bại , tên name_type đã tồn tại");
    }
    return res.json("Thêm mới thành công");
  } catch (err) {
    return messageError(err);
  }
};
const updateKeybourdType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { name_type, description } = req.body;
    const updateData = await KeybourdType.findByIdAndUpdate(id, {
      name_type,
      description,
      update_date: { type: Date, default: Date.now() },
    })
      .then((data) => {
        return res.json({
          message: "Sửa thành công",
          data: updateData,
        });
      })
      .catch((err) => {
        return res.json("Sửa thất bại");
      });
  } catch (err) {
    return messageError(err);
  }
};
const deleteKeybourdType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteData = await KeybourdType.findByIdAndDelete(id);
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
module.exports = {
  getKeybourdType,
  postKeybourdType,
  updateKeybourdType,
  deleteKeybourdType,
};
