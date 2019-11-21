const express = require("express");

const routes = express.Router();

//É possível modularizar mais?
routes.get("/", (req, res) => {
  res.json({ ok: true });
});

module.exports = routes;
