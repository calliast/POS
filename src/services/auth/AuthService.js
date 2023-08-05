const bcrypt = require("bcrypt");
const Model = require("../../models");
const Data = require("../../traits/data-format");

class AuthService {
  async login(req) {
    let status, message;
    const { email, password } = req.body;

    const user = await Model.User.findOne({ where: { email } });

    // Error: account not registered
    if (!user) {
      status = 404;
      message = `The provided email is not associated with any account`;

      req.flash(`error`, message);
      throw new Data(status, message);
    }

    // Error: wrong email or password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      status = 401;
      message = `The provided email or password is incorrect`;

      req.flash(`error`, message);
      throw new Data(status, message);
    }

    req.session.user = user;

    status = 200;
    message = `The user successfully logged in with valid credentials.`;

    return new Data(status, message, user);
  }

  logout = (req, res) => {};

  register = async (req) => {
    let status, message;

    const { name, email, password } = req.body;
    const isUserExist = await Model.User.findOne({ where: { email } });

    // Error: data duplicates
    if (isUserExist) {
      status = 409;
      message = `Email already registered`;

      req.flash(`error`, message);
      throw new Data(status, message);
    }

    const role = "Operator";
    const newUser = await Model.User.create({
      email,
      name,
      password,
      role,
    });

    status = 201;
    message = `Successful registration`;

    return new Data(status, message, newUser);
  };
}

module.exports = AuthService;
