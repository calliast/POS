// response-format
const Response = require("../../traits/response-format");

// User Service
const UnitService = require("./UnitService");
const unitService = new UnitService();

class UnitController {
  async usersPage(req, res) {
    res.render("./units/units", {
      user: req.session.user,
      error: req.flash(`error`),
      success: req.flash(`success`),
      active: `units`,
    });
  }

  async addPage(req, res) {
    res.render("./units/add", {
      user: req.session.user,
      active: `units/add`,
    });
  }

  async getUnits(req, res) {
    try {
      const { status, description, message, data } = await unitService.index(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.json(error);
    }
  }

  async getUnit(req, res) {
    try {
      const { status, description, message, data } = await unitService.showByID(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async addUnit(req, res) {
    try {
      const { status, description, message, data } = await unitService.create(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async updateUnit(req, res) {
    try {
      const { status, description, message, data } = await unitService.update(
        req
      );

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }

  async deleteUnit(req, res) {
    try {
      const { status, description, message, data } =
        await unitService.deleteByID(req);

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
        await unitService.isDuplicate(req);

      res
        .status(status)
        .send(new Response({ status, description, message }, data));
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UnitController;
