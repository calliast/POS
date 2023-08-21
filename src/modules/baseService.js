const statusPhrases = require("../traits/status-phrase");

class BaseService {
  #status;
  #message;
  #data;
  #description;
  #defaultDescription;

  constructor() {
    this.#status = null;
    this.#message = null;
    this.#data = null;
    this.#description = null;
  }

  setStatus(value) {
    this.#status = value;
    return this;
  }

  setMessage(className, serviceName) {
    this.#message = statusPhrases.message[className][serviceName][this.#status]
      ? statusPhrases.message[className][serviceName][this.#status]
      : `Either data for the entity is not yet set up or the status is Unknown`;
    return this;
  }

  setData(value) {
    this.#data = value;
    return this;
  }

  setDescription() {
    this.#description =
      statusPhrases.descriptions[this.#status] || `Unknown Status`;
    return this;
  }

  alertSuccess(req) {
    this.setDescription();
    req.flash("success", this.#message);
    return {
      status: this.#status,
      message: this.#message,
      description: this.#description,
      data: this.#data,
    };
  }

  alertError(req) {
    this.setDescription();
    req.flash("error", this.#message);
    throw {
      status: this.#status,
      message: this.#message,
      description: this.#description,
      data: this.#data,
    };
  }

  sendResponse() {
    return {
      status: this.#status,
      message: this.#message,
      description: this.#description,
      data: this.#data,
    };
  }
}

module.exports = BaseService;
