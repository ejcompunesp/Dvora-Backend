const express = require("express");
const multer = require("multer");

const FeedbackController = require("./controllers/FeedbackController");
const BoardController = require("./controllers/BoardController");
const JeController = require("./controllers/JeController");
const MemberController = require("./controllers/MemberController");
const DutyController = require("./controllers/DutyController");
const multerMiddleware = require("./middlewares/multer");
const LoginController = require("./controllers/LoginController");
const authJe = require("./middlewares/authJe");
const authMember = require("./middlewares/authMember");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ ok: false });
});

routes.post("/login", LoginController.login);

routes.get("/jes", JeController.index);
routes.post(
  "/jes/signup",
  multer(multerMiddleware).single("file"),
  JeController.store
);
routes.delete("/jes/delete", authJe, JeController.delete);
routes.put(
  "/jes/update",
  authJe,
  multer(multerMiddleware).single("file"),
  JeController.update
);

routes.get("/jes/:jeId/members", MemberController.index);
routes.post(
  "/jes/:jeId/members/signup",
  multer(multerMiddleware).single("file"),
  MemberController.store
);
routes.delete("/jes/:jeId/members/delete", authJe, MemberController.delete);
routes.put(
  "/jes/:jeId/members/update",
  authJe,
  multer(multerMiddleware).single("file"),
  MemberController.update
);

routes.get("/duties/:memberId", DutyController.index);
routes.post("/duties/register", DutyController.store);
routes.put("/duties/:dutyId/finish", DutyController.update);

routes.get("/feedback", FeedbackController.index);
routes.post("/duties/:dutyId/feedback", FeedbackController.store);
routes.delete("/duties/feedback/delete", authJe, FeedbackController.delete);
routes.put("/duties/feedback/update", authMember, FeedbackController.update);
routes.put(
  "/duties/feedback/monitoring",
  authJe,
  FeedbackController.updateMonitoring
);
routes.get("/duties/feedback/getId", authJe, FeedbackController.getId);

routes.get("/jes/:jeId/boards", BoardController.index)
routes.post("/jes/:jeId/boards/register", BoardController.store)
routes.delete("/jes/:jeId/boards/delete", BoardController.delete)
routes.put("/jes/:jeId/boards/update", BoardController.update)


module.exports = routes;
