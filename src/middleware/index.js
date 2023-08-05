const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.session.user.role == "Admin") {
    return next();
  }
  res.redirect("/sales");
};

module.exports = {
  isLoggedIn,
  isAdmin,
};
