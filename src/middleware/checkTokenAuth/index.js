function checkTokenExpiration(req, res, next) {
  const tokenExpiration = req.session.userTokens;
  if (tokenExpiration && Date.now() >= tokenExpiration) {
    delete req.session.userTokens;
    delete req.session.userTokens;
  }
  next();
}
function authenticateToken(req, res, next) {
  const token = req.session.userTokens;
  if (!token) {
    return res.sendStatus(401);
  }

  next();
}
module.exports = { checkTokenExpiration, authenticateToken };
