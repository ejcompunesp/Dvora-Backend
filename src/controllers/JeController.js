const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
const validPassword = (password, hash) => bcrypt.compareSync(password, hash);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async index(req, res) {
    try {
      const allJe = await Je.findAll();
      if (allJe.length == 0)
        return res.status(200).json({ msg: 'NOT FOUND' });
      else {
        for (let i = 0; i < allJe.length; i++)
          allJe[i].password = undefined;
        return res.status(200).json(allJe);
      }
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR' });
    }
  },

  async store(req, res) {
    let { name, email, password, university, image, creationYear } = req.body;

    password = generateHash(password);

    try {
      const je = await Je.create({ name, email, password, university, image, creationYear });
      je.password = undefined;
      return res.status(200).json({ je, token: generateToken({ id: je.id }) });
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR' });
    }
  },

  async login(req, res) {
    let { email, password } = req.body;
    try {
      let je = await Je.findOne({
        where: { email },
      });
      je = je.dataValues;
      if (je == null)
        return res.status(400).json({ msg: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, je.password);
      if (!ok)
        return res.status(400).json({ msg: 'INCORRECT PASSWORD' });
      else {
        je.password = undefined;
        return res.status(200).json({ je, token: generateToken({ id: je.id }) });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async delete(req, res) {
    let { email, senha } = req.body;
    const validPassword = (password, hash) => bcrypt.compareSync(password, hash);
    try {
      const je = await Je.findOne({
        where: { email },
      });
    } catch (error) {

    }
  },

  async update(req, res) {
    let { name, email, password, university, image, creationYear } = req.body;

  },
};