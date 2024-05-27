const { LikeAndComment } = require("../models");

const getCommentByProductID = async (req, res) => {
  try {
    const { idProduct } = req.body;
    const data = await LikeAndComment.findOne({ idProduct: idProduct });

    if (data === null) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận cho sản phẩm này",
      });
    }

    const ratingsCount = {
      "1_star": 0,
      "2_star": 0,
      "3_star": 0,
      "4_star": 0,
      "5_star": 0,
    };
    if (data.comments !== null) {
      data.comments.forEach((rating) => {
        switch (rating.rating) {
          case 1:
            ratingsCount["1_star"]++;
            break;
          case 2:
            ratingsCount["2_star"]++;
            break;
          case 3:
            ratingsCount["3_star"]++;
            break;
          case 4:
            ratingsCount["4_star"]++;
            break;
          case 5:
            ratingsCount["5_star"]++;
            break;
          default:
            break;
        }
      });
    }

    return res.json({ data, ratingsCount });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};

const createComment = async (req, res) => {
  try {
    const { idProduct, comment } = req.body;
    const create = await LikeAndComment.create({
      idProduct,
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
    const { idProduct, comments } = req.body;

    const insert = await LikeAndComment.findOne({ idProduct: idProduct });
    if (comments !== null) {
      insert.comments.push(comments);
    }
    await insert.save();
    res.status(201).json({ message: "Bình luận đã được thêm thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Kết nối thất bại vui lòng thử lại sau" });
  }
};
const likeComment = async (req, res) => {
  const { userId, idProduct } = req.body;
  const { commentId } = req.params;

  try {
    if (userId === null) {
      return res
        .status(401)
        .json({ message: "Vui lòng đăng nhập để có thể bày tỏ cảm xúc" });
    }
    global.io.emit("like", { userId, idProduct, commentId });
    const comment = await LikeAndComment.findOne({
      idProduct: idProduct,
      "comments._id": commentId,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment không tồn tại" });
    }

    const alreadyLiked = comment.comments.find(
      (commentItem) =>
        commentItem._id.toString() === commentId &&
        commentItem.likes.some((like) => like.userId.toString() === userId)
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Bạn đã like comment này rồi" });
    }

    const updatedComment = await LikeAndComment.findOneAndUpdate(
      { idProduct: idProduct, "comments._id": commentId },
      { $addToSet: { "comments.$.likes": { userId } } },
      { new: true }
    );

    res.json({ message: "Like thành công", comment: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const replyComment = async (req, res) => {
  try {
    const { userId, name, comment, idProduct } = req.body;
    const { commentId } = req.params;

    const reply = {
      userId,
      name,
      comment,
    };

    const updatedComment = await LikeAndComment.findOneAndUpdate(
      { idProduct, "comments._id": commentId },
      { $addToSet: { "comments.$.replies": { userId, name, comment } } },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment không tồn tại" });
    }
    res.json({
      message: "Trả lời comment thành công",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getCommentByProductID,
  createComment,
  insertComment,
  likeComment,
  replyComment,
};
