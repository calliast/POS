const route = require("../../config/router");

// Response Controller
const ResponseController = require("../../controllers/Response/ResponseController");
const responseController = new ResponseController();

// Authentication Controller
const AuthController = require("../../controllers/Auth/AuthController");
const authController = new AuthController();

route.group("", (router) => {
  router.get("/", authController.loginPage);
  router.post("/", authController.login);

  router.get("/register", authController.registerPage);
  router.post("/register", authController.register);

  router.get("/logout", authController.logout);
  router.get("/not-found", responseController.notFoundPage);
});

module.exports = route;
