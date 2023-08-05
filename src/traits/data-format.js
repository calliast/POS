class Data {
  constructor(status = 200, message = null, data = null) {
    this.status = status;
    this.description = this.setDefaultMessage();
    this.message = message;
    this.data = data;
  }

  setDefaultMessage() {
    const defaultMessages = {
      200: "Success",
      201: "Created",
      204: "No Content",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Unprocessable Entity",
      500: "Internal Server Error",
    };

    return defaultMessages[this.status] || "Unknown Status";
  }
}

module.exports = Data;
