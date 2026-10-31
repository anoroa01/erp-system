const express = require("express");
const router = express.Router();

const accountRoutes = require("./accountRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/account", accountRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
