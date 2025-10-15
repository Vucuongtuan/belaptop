const { Admin, AdminOnline } = require("../models");
const jwt = require("jsonwebtoken");
const { updateEmployeeLoginStatus, onlineEmployees } = require("./Socket");
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
const getProfileByID = async (req, res) => {
  try {
    const id = req.query.id;
    const get = await Admin.findById(id);
    if (get === null) {
      res.status(404).json({
        message: "Không tìm thấy profile có id là " + id,
      });
    }

    const birth = new Date(get.dateOfBirth);
    const formattedDatebirth = birth.toLocaleDateString("en-VI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const create = new Date(get.create_date);
    const formattedDatecreate = create.toLocaleDateString("en-VI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const update = new Date(get.update_date);
    const formattedDateupdate = update.toLocaleDateString("en-VI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    res.json({
      _id: get._id,
      email: get.email,
      password: get.password,
      phone: get.phone,
      dateOfBirth: formattedDatebirth,
      name: get.name,
      gender: get.gender,
      address: get.address,
      position: get.position,
      create_date: formattedDatecreate,
      update_date: formattedDateupdate,
    });
  } catch (err) {
    console.log(err);
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
    const check = await Admin.findOne({ email, password });

    if (check === null) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại.",
        description:
          "Vui lòng kiểm tra lại thông tin tài khoản hoặc thử lại sau",
      });
    }
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

    const token = jwt.sign(
      { email: check.email, Id: check._id },
      process.env.PASS_JWT,
      { expiresIn: oneWeekInMilliseconds }
    );
    const log = {
      id: check._id,
      name: check.name,
    };
    await updateEmployeeLoginStatus(check._id, check.name, check.position);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: oneWeekInMilliseconds,
      secure: true,
    });
    await AdminOnline.create({ idAdmin: check._id, name: check.name });
    return res.status(200).json({
      token,
      username: check.name,
      email: check.email,
      adminId: check._id,
      expiresIn: oneWeekInMilliseconds,
      message: "Đăng nhập thành công",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi vui lòng thử lại sau" });
  }
};
const getonLineAdmin = (req, res, next) => {
  try {
    const online = Array.from(onlineEmployees);
    if (online.length === 0) {
      res.status(404).json({ message: "Không có người nào " });
    }
    res.json(online);
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
const logoutOnLineAdmin = async (req, res, next) => {
  try {
    const idAdmin = req.body;
    const query = await AdminOnline.deleteOne({ idAdmin: idAdmin });
    if (query.length === 0) {
      res.status(404).json({ message: "Không có người nào " });
    }
    updateEmployeeLogoutStatus(idAdmin);
    res.json(query);
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
const updateAdmin = async (req, res, next) => {
  try {
    const {
      id,
      email,
      password,
      phone,
      dateOfBirth,
      name,
      gender,
      address,
      position,
    } = req.body;
    const query = await Admin.findByIdAndUpdate(
      { _id: id },
      {
        email,
        password,
        phone,
        dateOfBirth,
        name,
        gender,
        address,
        position,
      }
    );

    res.json(query);
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
module.exports = {
  getAdmin,
  postAdmin,
  deleteAdmin,
  getbyIDAdmin,
  loginAdmin,
  getonLineAdmin,
  logoutOnLineAdmin,
  getProfileByID,
  updateAdmin,
};
