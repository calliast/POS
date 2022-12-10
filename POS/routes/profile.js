var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../public/javascripts/util");

module.exports = function (db) {
  let sql;

  /* Change password */
  router.route("/auth/:id").get(isLoggedIn, async function (req, res) {
    try {
      res.render("./profile/auth", {
        user: req.session.user,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      res.json(error);
    }
  });

  /* Change profile */
  router
    .route("/main/:id")
    .get(isLoggedIn, async function (req, res) {
      try {
        console.log(req.session.user);
        res.render("./profile/profile", {
          user: req.session.user,
          error: req.flash("error"),
          success: req.flash("success"),
        });
      } catch (error) {
        res.send("error");
      }
    })
    /* Check if email already exist */
    .post(isLoggedIn, async function (req, res) {
      try {
        sql = `SELECT * FROM users WHERE email = $1`;

        const { rows: emailAvailable, rowCount: emailExist } = await db.query(
          sql,
          [req.body.email]
        );

        if (emailExist) {
          return res.json({
            data: null,
          });
        }

        res.json({
          data: emailAvailable,
        });
      } catch (error) {
        res.json(error);
      }
    });

  /* Saving new updated data */
  router.route("/update/:id").post(isLoggedIn, async function (req, res) {
    try {
      //. Checking for email and name
      const { newEmail, name } = req.body;
      const { id } = req.params;

      if (!newEmail || !name) {
        req.flash("error", "One or two data are invalid");
        return res.redirect(`/profile/main/${id}`);
      }

      //. Assigning new value, queries, and updating the database
      sql = `UPDATE users SET "email" = $1, "name" = $2 WHERE "userid" = $3 returning *`;
      const { rows: updatedProfile } = await db.query(sql, [
        newEmail,
        name,
        id,
      ]);

      if (!updatedProfile) {
        req.flash("error", "Fail to update");
        return res.redirect(`/profile/main/${id}`);
      }

      //. Re-update session with new data
      sql = `SELECT * FROM users WHERE userid = $1`;
      const { rows: updatedUser } = await db.query(sql, [id]);

      if (!updatedUser) {
        req.flash("error", "Fail to update");
        return res.redirect(`/profile/main/${id}`);
      }

      req.session.user = updatedUser[0];

      //. Redirect back to profile page
      req.flash("success", "Your profile has been updated.");
      res.redirect(`/profile/main/${id}`);
    } catch (error) {
      res.json(error);
    }
  });

  return router;
};
