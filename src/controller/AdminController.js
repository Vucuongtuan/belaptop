const { Admin } = require("../models");

const getAdmin = async () => {
  try {
    const data = await Admin.find();
    if (data.length === 0) {
      res.status(404).json({ message: "Không tìm thấy nhân viên nào" });
    }
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
const postAdmin = async () => {
  try {
    const { name, email, password, dateOfBirth, phone, address, gender } =
      req.body;

    const data = await Admin.create({
      name,
      email,
      password,
      dateOfBirth,
      phone,
      address,
      gender,
    });
    if (data.length === 0) {
      res.status(404).json({ message: "Không tìm thấy nhân viên nào" });
    }
    res.json({
      data: data,
      message: "Thêm mới nhân viên thành công",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
const deleteAdmin = async () => {
  try {
    const { id } = req.query;

    const data = await Admin.findByIdAndDelete(id);
    if (data.length === 0) {
      res.status(404).json({ message: "Không tìm thấy nhân viên nào" });
    }
    res.json({
      data: data,
      message: "Xóa nhân viên thành công",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
const getbyIDAdmin = async () => {
  try {
    const { id } = req.query;

    const data = await Admin.findById(id);
    if (data.length === 0) {
      res.status(404).json({ message: "Không tìm thấy nhân viên nào" });
    }
    res.json({
      data: data,
      message: "Lấy thông tin nhân viên thành công",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
module.exports = { getAdmin, postAdmin, deleteAdmin, getbyIDAdmin };
