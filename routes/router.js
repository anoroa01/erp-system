const express = require("express");
const router = express.Router();
const apiRouter = require("./api/apiRouter");

const apiBase = process.env.API_BASE || "/api/v1";

router.use(apiBase, apiRouter);

router.use(apiBase, (req, res) =>
  res.status(404).send("No API found on this route location"),
);

module.exports = router;
