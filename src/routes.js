const express = require("express");
const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/jes', JeController.index);
routes.post('/jes/signup', JeController.store);
routes.post('/jes/login', JeController.login);
routes.delete('/jes/delete', JeController.delete);
routes.put('/jes/update', JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', MemberController.store);

module.exports = routes;