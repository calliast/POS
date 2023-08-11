const express = require("express");
const router = express.Router();

const authRoute = require("./Auth/AuthRoutes");
const userRoute = require("./User/UserController");

router.use("", authRoute.export());
router.use("/user", userRoute.export());

module.exports = router;
