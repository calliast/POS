module.exports = class ResponseFormat {
  sendResponse(req, res) {
    let data = null;
    let status = 200;

    if (req.data) data = req.data;
    if (!req.status) status = 422;

    let result = {
      status: req.status,
      message: req.message,
      data,
    };

    res.status(status).send(result);
  }
};
