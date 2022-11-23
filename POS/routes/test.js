var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const helpers = require("../helpers/util");

module.exports = function (db) {
  router
    .route("/")
    .get(helpers.isLoggedIn, async function (req, res) {
      try {
        res.send(`you're in test page`);
      } catch (error) {
        res.json(error);
      }
    })
    // 1. filter - Check if Email Exist
    .post(helpers.isLoggedIn, async function (req, res) {
      try {
        const { email } = req.body;
        const response = {}

        let sql = `SELECT * FROM users WHERE "email" = $1`

        const checkEmail = await db.query(sql, [email])
        if (checkEmail.rowCount) {
          return res.json({
            data: null
          })
        }
        
        response.user = req.session.user
        response.data = checkEmail.rows
        response.input = email

        console.log(response);

        res.json(response);
      } catch (error) {
        res.json(error);
      }
    });

  return router;
};
