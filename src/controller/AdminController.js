const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const getAdmin = async (req, res, next) => {
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
const postAdmin = async (req, res, next) => {
  try {
    const { name, email, password, dateOfBirth, phone, address, gender } =
      req.body;
    console.log(req.body);
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
    console.log(err);
    return res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
const deleteAdmin = async (req, res, next) => {
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
const getbyIDAdmin = async (req, res, next) => {
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
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập tên đăng nhập và mật khẩu.",
      });
    }
    const check = await User.findOne({ email, password });

    if (!check.email) {
      return res.status(401).json({
        message: "Tài khoản không tồn tại.",
      });
    } else if (!check.password) {
      return res.status(401).json({
        message: "Mật khẩu không đúng",
      });
    }
    const token = jwt.sign(
      { email: check.email, Id: check._id },
      process.env.PASS_JWT,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      username: check.name,
      email: check.email,
      userId: check._id,
      expiresIn: 3600,
      message: "Đăng nhập thành công",
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
module.exports = { getAdmin, postAdmin, deleteAdmin, getbyIDAdmin, loginAdmin };
