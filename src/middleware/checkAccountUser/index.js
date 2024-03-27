const { AccountDataUser } = require("../../models");

const checkAccountUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const checkUser = await AccountDataUser.find({ username: username });
    console.log("====================================");
    console.log(checkUser);
    console.log("====================================");
    if (checkUser.length === 0) {
      return next();
    } else if (checkUser.length >= 1) {
      return res.json({
        message: `Username '${username}' đã tồn tại.`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi trong quá trình xử lý!!!",
    });
  }
};
const checkAccountID = async (req, res, next) => {
  try {
    const id = req.param.id;
    const checkID = await AccountDataUser.findById({ _id: id });
    if (checkID.length === 0) {
      return res.json({
        message: `Id người dùng ko tồn tại`,
      });
    } else if (checkID.length === 0) {
      return next();
    }
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi trong quá trình xử lý!!!",
    });
  }
};
module.exports = { checkAccountUser, checkAccountID };
