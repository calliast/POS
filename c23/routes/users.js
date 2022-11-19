var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("./page/users", { user: req.session.user });
});

module.exports = router;
