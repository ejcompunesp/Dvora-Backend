const express = require("express");
const multer = require("multer");

const JeController = require('./controllers/JeController');
const MemberController = require('./controllers/MemberController');
const authMiddleware = require('./middlewares/auth');
const multerMiddleware = require('./middlewares/multer');

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: true });
});

routes.get('/jes', JeController.index);
routes.post('/jes/signup', multer(multerMiddleware).single('file'), JeController.store);
routes.post('/jes/login', JeController.login);
routes.delete('/jes/delete', authMiddleware, JeController.delete);
routes.put('/jes/update', authMiddleware, multer(multerMiddleware).single('file'), JeController.update);

routes.get('/jes/:jeId/members', MemberController.index);
routes.post('/jes/:jeId/members/signup', multer(multerMiddleware).single('file'), MemberController.store);
routes.post('/members/login', MemberController.login);
routes.delete('/jes/:jeId/members/delete', MemberController.delete);
routes.put('/jes/:jeId/members/update', multer(multerMiddleware).single('file'), MemberController.update);

module.exports = routes;