var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const helpers = require("../helpers/util");

module.exports = function (db) {
  /* GET home page. */
  router.route("/").get(helpers.isLoggedIn, async function (req, res) {
    try {
      // let sql = `SELECT "userid", "email", "name", "password", "role" FROM users ORDER BY "userid" ASC`;
      let sql = `SELECT * FROM users`;
      const readData = await db.query(sql);
      // const readData = `test`
      res.render("./sb-admin2/index", {
        title: "Express",
        data: readData.rows,
        user: req.session.user,
      });
    } catch (error) {
      res.send("error");
    }
  });

  router.route("/logout").get(async function (req, res) {
    await req.session.destroy();
    res.redirect("/login");
  });

  router
    .route("/login")
    .get(async function (req, res) {
      res.render("./sb-admin2/login", { info: req.flash(`info`) });
    })
    .post(async function (req, res) {
      try {
        let sql = `SELECT * FROM users WHERE email = $1`;
        const { email, password } = req.body;

        const checkEmail = await db.query(sql, [email]);
        if (checkEmail.rows.length == 0) {
          req.flash(`info`, `Email tidak terdaftar`);
          return res.redirect("/login");
        }

        const checkPassword = await bcrypt.compare(
          password,
          checkEmail.rows[0].password
        );
        if (!checkPassword) {
          req.flash(`info`, `Password Salah!`);
          return res.redirect('/login');
        }

        req.session.user = checkEmail.rows[0];
        res.redirect('/');
      } catch (error) {
        res.send(error);
      }
    });

  router
    .route("/register")
    .get(async function (req, res) {
      res.render("./sb-admin2/register", { info: req.flash(`info`) });
    })
    .post(async function (req, res) {
      try {
        let sql = `SELECT * FROM users where email = $1`;
        const { name, email, password } = req.body;
        const role = "admin";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const checkData = await db.query(sql, [email]);
        console.log(checkData.rows);
        if (checkData.rowCount > 0) {
          req.flash(`info`, `Email sudah terdaftar`);
          return res.redirect('/register');
        }

        sql = `INSERT INTO users("email", "name", "password", "role") VALUES ($1, $2, $3, $4)`;

        const insertData = await db.query(sql, [
          email,
          name,
          hashedPassword,
          role,
        ]);

        res.redirect("/login");
      } catch (error) {
        res.send(error);
      }
    });

  return router;
};
