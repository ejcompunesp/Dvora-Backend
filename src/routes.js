const express = require("express");
const EjController = require('./controllers/EjController')

const routes = express.Router();

//É possível modularizar mais?
routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/ejs', EjController.index);
routes.post('/ejs', EjController.store);

module.exports = routes;
