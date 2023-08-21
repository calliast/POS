const route = require("../../config/router");

// Response Controller
const ResponseHandler = require("../Handler/ResponseHandler");
const responseHandler = new ResponseHandler();

// Authentication Controller
const AuthController = require("./AuthController");
const authController = new AuthController();

route.group("", (router) => {
  router.get("/", authController.loginPage);
  router.post("/", authController.login);

  router.get("/register", authController.registerPage);
  router.post("/register", authController.register);

  router.get("/logout", authController.logout);
  router.get("/not-found", responseHandler.notFoundPage);
});

module.exports = route;
