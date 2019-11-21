const express = require("express");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

module.exports = routes;
