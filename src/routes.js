const express = require("express");
const EjController = require('./controllers/JeController')

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/jes', EjController.index);
routes.post('/jes/signup', EjController.store);
routes.post('/jes/login', EjController.login);

module.exports = routes;
