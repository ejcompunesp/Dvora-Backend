const express = require("express");
const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');
const LoginController = require('./controllers/LoginController');
const authJe = require('./middlewares/authJe');
const authMember = require('./middlewares/authMember');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.post('/login', LoginController.login);

routes.get('/jes', JeController.index);
routes.post('/jes/signup', JeController.store);
routes.delete('/jes/delete', authJe, JeController.delete);
routes.put('/jes/update', authJe, JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', MemberController.store);
routes.delete('/jes/:jeId/members/delete', authMember, MemberController.delete);
routes.put('/jes/:jeId/members/update', authMember, MemberController.update);

module.exports = routes;