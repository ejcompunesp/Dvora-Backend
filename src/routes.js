const express = require("express");
const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');
const LoginController = require('./controllers/LoginController');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.post('/login', LoginController.login);

routes.get('/jes', JeController.index);
routes.post('/jes/signup', JeController.store);
// routes.post('/jes/login', JeController.login);
routes.delete('/jes/delete', authMiddleware, JeController.delete);
routes.put('/jes/update', authMiddleware, JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', MemberController.store);
// routes.post('/members/login', MemberController.login);
routes.delete('/jes/:jeId/members/delete', MemberController.delete);
routes.put('/jes/:jeId/members/update', MemberController.update);

module.exports = routes;