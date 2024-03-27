const { MouseType } = require("../models");

const getMouseType = async (req, res, next) => {
  try {
    const getMouseType = await MouseType.find({});
    if (getMouseType.length === 0) {
      return res.status(404).json({
        message: "Không có loại chuột nào !!!",
      });
    }
    return res.json(getMouseType);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối ,vui lòng thử lại sau !!!",
      error: err,
    });
  }
};
const postMouseType = async (req, res, next) => {
  try {
    const { name_type, description } = req.body;
    const postType = await MouseType.create({
      name_type,
      description,
    });
    return res.json({
      message: "Thêm loại chuột thành công",
      data: postType,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối ,vui lòng thử lại sau !!!",
      error: err,
    });
  }
};
const updateMouseType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { name_type, description } = res.body;
    const updateType = await MouseType.findByIdAndUpdate(id, {
      name_type: name_type,
      description: description,
      update_date: Date.now(),
    });
    return res.json({
      message: "Cập nhật loại chuột thành công !!!",
      data: updateType,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối ,vui lòng thử lại sau !!!",
      error: err,
    });
  }
};
const deleteMouseType = async (req, res, next) => {
  try {
    const id = req.query.id;
    const deleteType = await MouseType.findByIdAndDelete(id);
    return res.json({
      message: "Xóa thành công",
      data: deleteType,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối ,vui lòng thử lại sau !!!",
      error: err,
    });
  }
};

module.exports = {
  getMouseType,
  postMouseType,
  updateMouseType,
  deleteMouseType,
};
