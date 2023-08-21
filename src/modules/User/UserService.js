const { User } = require("../../models");
const baseService = require("../baseService");
const { Op } = require("sequelize");

class UserService extends baseService {
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

    this.setStatus(200)
      .setMessage(`UserService`, "index")
      .setData(response)
      .sendResponse();
  }

  async showByID(req) {
    const { userid } = req.params;
    const user = await User.findByPk(parseInt(userid));

    this.setStatus(200)
      .setMessage(`UserService`, "showByID")
      .setData(user)
      .sendResponse();
  }

  async isDuplicate(req) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      this.setStatus(409)
        .setMessage(`UserService`, `isDuplicate`)
        .setData(user)
        .alertError(req);
    }

    this.setStatus(200)
      .setMessage(`UserService`, `isDuplicate`)
      .setData(user)
      .alertSuccess(req);
  }

  async create(req) {
    const newUser = await User.create(req.body);

    if (!newUser) {
      this.setStatus(409)
        .setMessage(`UserService`, `create`)
        .setData(newUser)
        .alertError(req);
    }

    this.setStatus(200)
      .setMessage(`UserService`, `create`)
      .setData(newUser)
      .alertSuccess(req);
  }

  async update(req) {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.params.userid,
      },
      returning: true,
      plain: true,
    });

    this.setStatus(200)
      .setMessage(`UserService`, `update`)
      .setData(updatedUser)
      .alertSuccess(req);
  }

  async deleteByID(req) {
    const deleteUser = await User.destroy({
      where: {
        id: req.params.userid,
      },
    });

    this.setStatus(204)
      .setMessage(`UserService`, `deleteByID`)
      .setData(deleteUser)
      .alertSuccess(req);
  }
}

module.exports = UserService;
