const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

const currencyFormatter = new Intl.NumberFormat("id", {
  style: "currency",
  currency: "IDR",
});

module.exports = {
  isLoggedIn,
  currencyFormatter,
};
