const { request } = require("express");
const { User, Cart, OTP } = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const getDataAccountUser = async (req, res, next) => {
  try {
    await User.find({})
      .populate("AccountId")
      .then((user) => {
        if (user.length <= 0) {
          return res.json({ message: "Không có người dùng nào" });
        } else {
          return res.json({
            total: user.length,
            data: user,
          });
        }
      })
      .catch((err) => {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        return res.json({ message: "Lỗi vui lòng thử lại sau" });
      });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return res.status(500).json({
      message: "Error connecting to the database !!!",
      err: err,
    });
  }
};
const getDataByIDAccountUser = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { name } = req.body;
    let query;
    if (id) {
      query = { _id: id };
    } else if (name) {
      query = { full_name: name };
    } else {
      return res.status(400).json({
        message: "Thiếu thông tin tìm kiếm vui lòng nhập lại !!",
      });
    }

    const user = await User.findOne(query).populate("cartID").exec();

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    return res.json({
      data: user,
    });
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    return res.status(500).json({
      message: "Error connecting to the database !!! 123",
    });
  }
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL_SEND_OTP,
        pass: process.env.AUTH_PASS_SEND_OTP,
        // user: process.env.AUTH_EMAIL_SEND_OTP,
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    const mailOptions = {
      from: process.env.AUTH_EMAIL_SEND_OTP,
      to: email,
      subject: "OTP xác thực đăng ký tài khoản LaptopTC",
      text: `Mã Otp của bạn là: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    throw new Error("Error sending OTP email :" + { error });
  }
};

const sendOTPToEmailMiddleware = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await sendOTP(email, otp);
    await OTP.create({ email, otp });

    return res.status(200).json({
      message: "Mã OTP đã được gửi đến email.",
    });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({
      message: "Error sending OTP.",
    });
  }
};
const postDataAccountUser = async (req, res, next) => {
  try {
    const { name, address, email, phone, password } = req.body;
    const cart = await Cart.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
    });
    await User.create({
      name,
      address,
      email,
      password: password,
      phone,
      cartID: cart._id,
    });

    return res.status(200).json({
      message: "thêm người dùng thành công",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error connecting to the database !!!",
    });
  }
};
const putDataAccountUser = async (req, res, next) => {
  try {
    const id = req.query.id;
    const password = req.body.password;
    await User.findByIdAndUpdate(id, {
      password: password,
    })
      .then((data) => {
        if (data.length === 0) {
          return res.status(404).json({
            message: "Không tìm thấy người dùng có ID là :" + id,
          });
        }
        return res.json({
          id: data._id,
          username: data.username,
          message: "Sửa tài khoản thành công ",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Sửa tài khoản thất bại thử lại sau",
        });
      });
  } catch {
    return res.status(500).json({
      message: "Lỗi kết nối với database",
    });
  }
};
const deleteAccountUser = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }
    await AccountUser.deleteMany({ userID: userId });
    await Cart.deleteMany({ userID: userId });
    res.json({
      id: user._id,
      username: user.username,
      message: "Đã xóa user thành công!",
    });
  } catch {
    res.status(500).json({
      message: "Lỗi kết nối với Database !!!",
    });
  }
};

const loginAccountApp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập tên đăng nhập và mật khẩu.",
      });
    }
    const emailCheck = await User.findOne({ email });

    if (!emailCheck) {
      return res.status(401).json({
        message: "Tài khoản không tồn tại.",
      });
    }
    const isPasswordValid = await User.findOne({ password });
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Mật khẩu không đúng.",
      });
    }
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const token = jwt.sign(
      { email: emailCheck.email, userId: emailCheck._id },
      process.env.PASS_JWT,
      { expiresIn: oneWeekInMilliseconds }
    );

    res.cookie("token", token, { maxAge: oneWeekInMilliseconds });
    req.session.userTokens = req.session.userTokens || [];
    req.session.userTokens.push(token);
    res.status(200).json({
      token,
      username: emailCheck.name,
      email: emailCheck.email,
      userId: emailCheck._id,
      expiresIn: oneWeekInMilliseconds,
    });
  } catch {
    return res.status(500).json({
      message: "Lỗi kết nối với Database !!!",
    });
  }
};
module.exports = {
  getDataAccountUser,
  getDataByIDAccountUser,
  postDataAccountUser,
  putDataAccountUser,
  deleteAccountUser,
  loginAccountApp,
  sendOTP,
  sendOTPToEmailMiddleware,
};
