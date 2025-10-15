const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token." });
    }

    const decodedToken = jwt.verify(token, process.env.PASS_JWT);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ." });
  }
};
module.exports = verifyToken;
