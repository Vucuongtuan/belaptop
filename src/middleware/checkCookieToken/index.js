function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers["authorization"];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
}
