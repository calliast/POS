class serviceRoot {
  constructor() {
    this.status = null;
    this.message = null;
    this.req = null;
  }

  setNotification(req, status, message) {
    req.flash(status, message);
  }
}

module.exports = serviceRoot;
