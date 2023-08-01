const { MainService } = require("../../services");
const mainService = new MainService();

class MainController {
  index(req, res) {
    res.render("login", { error: req.flash(`error`) });
  }

  notFound(req, res) {
    res.render("404", )
  }
}

module.exports = MainController;
