const { Router } = require("express");
const RouteGroup = require("express-route-grouping").default;

const route = new RouteGroup("", Router());

// Authentication Controller
const AuthController = require("../controllers/auth/AuthController");
const authController = new AuthController();

route.group("", (router) => {
  router.get("/not-found", (req, res) => res.render("404"));

  router.get("/", authController.loginPage);
  router.post("/", authController.login);

  router.get("/register", authController.registerPage);
  router.post("/register", authController.register);
});

module.exports = route;
