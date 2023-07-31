const express = require("express");
const bcrypt = require("bcrypt");
const Model = require("../../models");

class AuthService {
  async login(req) {
    try {
      const { email, password } = req.body;

      const user = await Model.User.findOne({ where: { email } });

      await bcrypt.compare(password, user.password).then((status) => {
        const result = {
          status: false,
          message: "Incorrect password!",
        };
        req.flash(`error`, `Incorrect password!`);
        throw new Error(`Incorrect password`);
      });

      req.session.user = user;

      if (req.session.user.role === "Operator") {
        return (
          res
            // .redirect("/sales")
            .json("anda operator")
        );
      }

      res
        //   .redirect("/dashboard")
        .json("anda admin");

      //   console.log(user);

      // sql = `SELECT * FROM users WHERE email = $1`;

      // const checkEmail = await db.query(sql, [email]);
      // if (checkEmail.rows.length == 0) {
      //   req.flash(`error`, `Email not registered!`);
      //   return res.redirect("/");
      // }

      // const checkPassword = await bcrypt.compare(
      //   password,
      //   checkEmail.rows[0].password
      // );
      // if (!checkPassword) {
      //   req.flash(`error`, `Wrong password!`);
      //   return res.redirect("/");
      // }

      // req.session.user = checkEmail.rows[0];

      // if (req.session.user.role == "operator") {
      //   return res.redirect("/sales");
      // }

      // res.redirect("/dashboard");
    } catch (error) {
      res.redirect("/not-found");
    }
  }

  logout = (req, res) => {};

  register = async (req) => {
    try {
      const role = "Operator";
      const { name, email, password } = req.body;
      console.log(req.body);

      const user = await Model.User.findOne({ where: { email } });

      if (user) {
        req.flash(`error`, `Email already registered`);
        return {
          status: 500,
          data: null,
          message: `User already exist`,
        };
      }

      const newUser = await Model.User.create({
        email,
        name,
        password,
        role,
      });

      return { data: newUser };
    } catch (error) {
      return { error };
    }
  };
}

module.exports = AuthService;
