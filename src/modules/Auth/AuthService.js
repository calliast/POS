const bcrypt = require("bcrypt");
const { User } = require("../../models");
const baseService = require("../baseService");

class AuthService extends baseService {
  async login(req) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // Error: account not registered
    if (!user) {
      this.setStatus(404).setMessage("AuthService", "login").alertError(req);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    // Error: wrong email or password
    if (!isPasswordMatched) {
      this.setStatus(401)
        .setMessage(`AuthService`, "login")
        .setData(isPasswordMatched)
        .alertError(req);
    }

    req.session.user = user;

    this.setStatus(200)
      .setMessage(`AuthService`, "login")
      .setData(user)
      .alertSuccess(req);
  }

  register = async (req) => {
    const { name, email, password } = req.body;
    const isUserExist = await User.findOne({ where: { email } });

    // Error: data duplicates
    if (isUserExist) {
      this.setStatus(409)
        .setMessage(`AuthService`, "register")
        .setData(isUserExist)
        .alertError(req);
    }

    const role = "Operator";
    const newUser = await User.create({
      email,
      name,
      password,
      role,
    });

    this.setStatus(201)
      .setMessage(`AuthService`, "register")
      .setData(newUser)
      .alertSuccess(req);
  };
}

module.exports = AuthService;
