const { LikeAndComment } = require("../models");

const getCommentByProductID = async (req, res) => {
  try {
    const { idProduct } = req.body;
    const data = await LikeAndComment.findOne({ idProduct: idProduct });
    if (data === null) {
      res.status(404).json({
        message: "Khong tim thấy",
      });
      return;
    }
    return res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
const createComment = async (req, res) => {
  try {
    const { idProduct, likes, dislikes, comment } = req.body;
    const create = await LikeAndComment.create({
      idProduct,
      likes,
      dislikes,
      comment,
    });
    res.json(create);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
const insertComment = async (req, res) => {
  try {
    const { idProduct, likes, dislikes, comment } = req.body;
    const insert = await LikeAndComment.fineOne({ idProduct: idProduct });

    if (likes !== null) {
      insert.likes += 1;
    } else if (dislikes !== null) {
      insert.dislikes += 1;
    } else if (comment !== null) {
      insert.comment.push(comment);
    }
    await insert.save();
    res.status(201).json({ message: "Bình luận đã được thêm thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
module.exports = { getCommentByProductID, createComment, insertComment };
