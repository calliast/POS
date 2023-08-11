const { User } = require("../../models");
const Data = require("../../traits/data-format");
const serviceRoot = require("../serviceRoot");
const { Op } = require("sequelize");

class UserService extends serviceRoot {
  async index(req) {
    const { search } = req.query;

    const searchCriteria = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search.value}%` } },
        { email: { [Op.iLike]: `%${search.value}%` } },
      ],
    };

    // Get total count
    const total = await User.count({
      where: searchCriteria,
    });

    // Query data with pagination and sorting
    const data = await User.findAll({
      where: searchCriteria,
      order: [[columns[order[0].column].data, order[0].dir]],
      limit: parseInt(length, 10),
      offset: parseInt(start, 10),
    });

    const response = {
      draw: parseInt(req.query.draw, 10),
      recordsTotal: total,
      recordsFiltered: total,
      data,
      info: req.flash("info"),
    };

    this.status = 200;
    this.message = `The list of users is successfully fetched for display or processing`;
    return new Data(this.status, this.message, response);
  }

  async showByID(req) {
    const { userid } = req.params;

    const user = await User.findByPk(parseInt(userid));

    this.status = 200;
    this.message = `The user data is successfully fetched for display or processing`;

    return new Data(this.status, this.message, user);
  }

  async isDuplicate(req) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      this.status = 409;
      this.message = `Email Already Exists`;
      this.setNotification(req, `error`, this.message);

      return new Data(this.status, this.message);
    }

    this.status = 200;
    this.message = `Email is available to use`;
    this.setNotification(req, `success`, this.message);

    return new Data(this.status, this.message, user);
  }

  async create(req) {
    const newUser = await Model.User.create(req.body);

    if (!newUser) {
      this.status = 409;
      this.message = `User Already Exists`;
      this.setNotification(req, `error`, this.message);

      throw new Data(this.status, this.message);
    }

    this.status = 200;
    this.message = `The user account is successfully created.`;
    this.setNotification(req, `success`, this.message);

    return new Data(this.status, this.message, newUser);
  }

  async update(req) {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.params.userid,
      },
      returning: true,
      plain: true,
    });

    this.status = 200;
    this.message = `User ${req.body.name} has been updated`;
    this.setNotification(req, this.status, this.message);

    return new Data(this.status, this.message, updatedUser);
  }

  async deleteByID(req) {
    const deleteUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    this.status = 204;
    this.message = `The user account is successfully deleted`;
    this.setNotification(req, `success`, this.message);

    return new Data(this.status, this.message, deleteUser);
  }
}

module.exports = UserService;
