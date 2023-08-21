const express = require("express");
const router = express.Router();

const authRoute = require("../modules/Auth/AuthRoutes");
const userRoute = require("../modules/User/UserRoutes");

router.use("", authRoute.export());
router.use("/user", userRoute.export());

module.exports = router;
