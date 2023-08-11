const route = require("../../config/router");

// Authentication Controller
const UserController = require("../../controllers/User/UserController");
const userController = new UserController();

route.group("/user", (router) => {
  router.get("/", userController.usersPage);
  router.get("/users-list", userController.getUsers);

  router.get("/add", userController.addPage);
  router.post("/add", userController.addUser);

  router.post("/email-check", userController.checkEmail);

  router.patch("/:userid", userController.updateUser);
  router.delete("/:userid", userController.deleteUser);
  

});

module.exports = route;
