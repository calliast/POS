// response-format
const Response = require("../../traits/response-format");

// User Service
const UserService = require("./UserService");
const userService = new UserService();

class UserController {
  async usersPage(req, res) {
    res.render("./users/users", {
      user: req.session.user,
      error: req.flash(`error`),
      success: req.flash(`success`),
      active: `users`,
    });
  }

  async addPage(req, res) {
    res.render("./users/add", {
      user: req.session.user,
      active: `users/add`,
    });
  }

  async getUsers(req, res) {
    try {
      const { status, description, message, data } = await userService.index(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.json(error);
    }
  }

  async getUser(req, res) {
    try {
      const { status, description, message, data } = await userService.showByID(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async addUser(req, res) {
    try {
      const { status, description, message, data } = await userService.create(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async updateUser(req, res) {
    try {
      const { status, description, message, data } = await userService.update(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async deleteUser(req, res) {
    try {
      const { status, description, message, data } =
        await userService.deleteByID(req);

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async checkEmail(req, res) {
    try {
      const { status, description, message, data } =
        await userService.isDuplicate(req);

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController;
