// response-format
const ResponseFormat = require("../../traits/response-format");
const responseFormat = new ResponseFormat();

// services
const { AuthService } = require("../../services");
const authService = new AuthService();

class AuthController {
  login = async (req, res) => {
    try {
      const result = await authService.login(req);

      responseFormat.sendResponse(result, res);
    } catch (error) {
      res.send(error);
      // res.redirect("/");
    }
  };

  register = async (req, res) => {
    try {
      const result = await authService.register(req);

      responseFormat.sendResponse(result, res);
      // res.redirect
    } catch (error) {
      res.send(error);
      // res.redirect("/register");
    }
  };
}

module.exports = AuthController;
