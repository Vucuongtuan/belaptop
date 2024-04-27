const { Blog } = require("../models");
const fs = require("fs");
const { getAllProduct } = require("./AllProductController");
const getAllBlog = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await Blog.find()
      .skip((page - 1) * process.env.LIMIT)
      .limit(process.env.LIMIT);
    const totalPages = Math.ceil(data.length / process.env.LIMIT);
    if (data.length === 0) {
      res.status(404).json({ message: "Không có bài blog nào" });
      return;
    }
    res.json({
      total: data.length,
      totalPage: totalPages,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi xử lý vui lòng thử lại sau",
    });
  }
};
const getBlogByIdProduct = async (req, res) => {
  try {
    const { idProduct } = req.body;
    const blog = await Blog.findOne({
      idProduct: idProduct,
    });
    if (blog === null) {
      res.status(404).json({
        message: "Không có bài viết nào ",
      });
      return;
    }

    res.json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi xử lý vui lòng thử lại sau",
    });
  }
};
const getBlogById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const getById = await Blog.findById(id);
    if (getById === null) {
      res.status(404).json({ message: "Bài blog không tồn tại" });
      return;
    }
    res.status(200).json(getById);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi xử lý vui lòng thử lại sau",
    });
  }
};
const getBlogByName = async (req, res, next) => {
  try {
    const name = req.body.name;
    const getByName = await Blog.find({
      name: { $regex: name, $options: "i" },
    });
    if (getByName === null) {
      res.status(404).json({ message: "Bài blog không tồn tại" });
      return;
    }
    res.status(200).json(getByName);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi xử lý vui lòng thử lại sau",
    });
  }
};
const createBlog = async (req, res, next) => {
  try {
    const reqFile = req.file;

    const parts = reqFile.originalname.split(".");
    const ext = parts[parts.length - 1];
    fs.renameSync(reqFile.path, reqFile.path + "." + ext);
    if (!reqFile.filename) {
      return res.status(400).json({
        message: "Thiếu hình ảnh.",
      });
    }

    const { title, description, body, author, idAuthor, idProduct } = req.body;
    const post = await Blog.create({
      title,
      description,
      body,
      thumbnail:
        process.env.BASE_URL + "/image/" + reqFile.filename + "." + ext,
      author,
      idAuthor,
      idProduct,
      date_create: Date.now(),
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Lỗi xử lý vui lòng thử lại sau",
    });
  }
};

module.exports = {
  getAllBlog,
  getBlogById,
  createBlog,
  getBlogByName,
  getBlogByIdProduct,
  getBlogByIdProduct,
};