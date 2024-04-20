const verifyToken = require("../middleware/verifyToken");

const checkTokenAdmin = async () => {
  try {
    const { token } = req.body;
    verifyToken(token);
    if (verifyToken === false) {
      res.json({ auth: false });
    } else {
      res.json({ auth: true });
    }
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    res.status(500).json({ message: "Có lỗi xảy ra vui lòng thử lại sau" });
  }
};

module.exports = { checkTokenAdmin };
