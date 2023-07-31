const express = require("express");
const router = express.Router();

const authRoute = require("./auth-routes");

router.use("", authRoute.export());

module.exports = router;
