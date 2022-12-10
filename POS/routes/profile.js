var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  /* HOMEPAGE - DASHBOARD */
  router
  .route("/:id")
  .get(isLoggedIn, async function (req, res) {
    let sql;
    try {
        console.log(req.session.user);
      res.render("./profile/profile", {
        user: req.session.user,
        info: req.flash('info')
      });
    } catch (error) {
      res.send("error");
    }
  })
  /* Check if email already exist */
    .post(isLoggedIn, async function(req, res) {
    try {
        sql = `SELECT * FROM users WHERE email = $1`
        
        const {rows: emailAvailable, rowCount: emailExist} = await db.query(sql, [req.body.email])

        if (emailExist) {
            return res.json({
                data: null
            })
        }

        res.json({
            data: emailAvailable
        })
    } catch (error) {
        res.json(error)
    }
  })

  return router;
};
