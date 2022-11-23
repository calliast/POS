var express = require("express");
var router = express.Router();
const helpers = require("../helpers/util");

module.exports = function (db) {

  /* USERS Route. */
  router
  .route("/")
  .get(helpers.isLoggedIn, async function (req, res) {
    try {
      res.render("./users/users", { 
        user: req.session.user,
        info: req.flash(`info`)  
      });
    } catch (error) {
      res.json(error);
    }
  });

  return router;
};
