const express = require("express");
const router = express.Router();

const authRoute = require("./AuthRoutes");

router.use("", authRoute.export());

module.exports = router;
