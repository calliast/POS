const { Router } = require("express");
const RouteGroup = require("express-route-grouping").default;

const route = new RouteGroup("", Router());

// Main Controller
const MainController = require("../controllers/main/main-controller");
const mainConstroller = new MainController();

// Authentication Controller
const AuthController = require("../controllers/auth/auth-controller");
const authController = new AuthController();

route.group("", (router) => {
  router.get("/", mainConstroller.index);

  router.post("/login", authController.login);
  router.post("/register", authController.register);
});

module.exports = route;
