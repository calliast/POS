const bcrypt = require("bcrypt");
const Model = require("../../models");
const Data = require("../../traits/data-format");
const serviceRoot = require("../serviceRoot");

class AuthService extends serviceRoot {
  async login(req) {
    const { email, password } = req.body;

    const user = await Model.User.findOne({ where: { email } });

    // Error: account not registered
    if (!user) {
      this.status = 404;
      this.message = `The provided email is not associated with any account`;
      this.setNotification(req, `error`, this.message);

      throw new Data(this.status, this.message);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    // Error: wrong email or password
    if (!isPasswordMatched) {
      this.status = 401;
      this.message = `The provided email or password is incorrect`;
      this.setNotification(req, `error`, this.message);

      throw new Data(this.status, this.message);
    }

    req.session.user = user;

    this.status = 200;
    this.message = `The user successfully logged in with valid credentials.`;

    return new Data(this.status, this.message, user);
  }

  register = async (req) => {
    const { name, email, password } = req.body;
    const isUserExist = await Model.User.findOne({ where: { email } });

    // Error: data duplicates
    if (isUserExist) {
      this.status = 409;
      this.message = `Email already registered`;
      this.setNotification(req, `error`, this.message);

      throw new Data(this.status, this.message);
    }

    const role = "Operator";
    const newUser = await Model.User.create({
      email,
      name,
      password,
      role,
    });

    this.status = 201;
    this.message = `Successful registration`;

    return new Data(this.status, this.message, newUser);
  };
}

module.exports = AuthService;
