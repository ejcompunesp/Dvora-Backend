const express = require("express");
const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');
const DutyController = require('./controllers/DutyController');
const authMiddleware = require('./middlewares//auth');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/jes', JeController.index);
routes.post('/jes/signup', JeController.store);
routes.delete('/jes/delete', authJe, JeController.delete);
routes.put('/jes/update', authJe, JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', MemberController.store);
routes.post('/members/login', MemberController.login);
routes.delete('/jes/:jeId/members/delete', authMiddleware, MemberController.delete);
routes.put('/jes/:jeId/members/update', authMiddleware, MemberController.update);

routes.get('/duties/:memberId', DutyController.index);
routes.post('/duties/register', DutyController.store);
routes.put('/duties/:dutyId/finish', DutyController.update);

module.exports = routes;