const express = require("express");
const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');
const ProjectController = require('./controllers/ProjectController');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/jes', JeController.index);
routes.post('/jes/signup', JeController.store);
routes.post('/jes/login', JeController.login);
routes.delete('/jes/delete', authMiddleware, JeController.delete);
routes.put('/jes/update', authMiddleware, JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', MemberController.store);
routes.post('/members/login', MemberController.login);
routes.delete('/jes/:jeId/members/delete', authMiddleware, MemberController.delete);
routes.put('/jes/:jeId/members/update', authMiddleware, MemberController.update);

routes.get('/jes/:jeId/projects', ProjectController.index);
routes.post('/jes/:jeId/projects/create', ProjectController.store);
routes.post('/jes/:jeId/projects/:projectId', ProjectController.addMember);
routes.delete('/jes/:jeId/projects/:projectId/delete', ProjectController.delete);
routes.put('/jes/:jeId/projects/:projectId/update', ProjectController.update);

module.exports = routes;