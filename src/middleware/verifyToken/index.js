const jwt = require("jsonwebtoken");
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const { exp } = decoded;
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = verifyToken;
