const { Unit } = require("../../models");
const baseService = require("../baseService");

class UnitService extends baseService {
  async index(req) {
    const { search } = req.query;

    const searchCriteria = {
      [Op.or]: [
        { unit: { [Op.iLike]: `%${search.value}%` } },
        { name: { [Op.iLike]: `%${search.value}%` } },
        { note: { [Op.iLike]: `%${search.value}%` } },
      ],
    };

    // Get total count
    const total = await Unit.count({
      where: searchCriteria,
    });

    // Query data with pagination and sorting
    const data = await Unit.findAll({
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
      .setMessage(`UnitService`, "index")
      .setData(response)
      .sendResponse();
  }

  async showByID(req) {
    const { unitid } = req.params;
    const unit = await Unit.findByPk(parseInt(unitid));

    this.setStatus(200)
      .setMessage(`UnitService`, "showByID")
      .setData(unit)
      .sendResponse();
  }

  async create(req) {
    const newUnit = await Unit.create(req.body);

    if (!newUnit) {
      this.setStatus(409)
        .setMessage(`UnitService`, `create`)
        .setData(newUnit)
        .alertError(req);
    }

    this.setStatus(200)
      .setMessage(`UnitService`, `create`)
      .setData(newUnit)
      .alertSuccess(req);
  }

  async isDuplicate(req) {
    const { unit } = req.body;

    const isUnitExist = await Unit.findOne({ where: { unit } });

    if (!unit) {
      this.setStatus(409)
        .setMessage(`UnitService`, `isDuplicate`)
        .setData(isUnitExist)
        .alertError(req);
    }

    this.setStatus(200)
      .setMessage(`UnitService`, `isDuplicate`)
      .setData(isUnitExist)
      .alertSuccess(req);
  }

  async update(req) {
    const updatedUnit = await Unit.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
      plain: true,
    });

    this.setStatus(200)
      .setMessage(`UnitService`, `update`)
      .setData(updatedUnit)
      .alertSuccess(req);
  }

  async deleteByID(req) {
    const deleteUnit = await Unit.destroy({
      where: {
        id: req.params.unitid,
      },
    });

    this.setStatus(204)
      .setMessage(`UnitService`, `deleteByID`)
      .setData(deleteUnit)
      .alertSuccess(req);
  }
}

module.exports = UnitService;
