function auth(req, res, next) {
  if (req.user && req.user.id) return next();

  return res.sendStatus(401);
}

module.exports = auth;
