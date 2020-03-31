const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async index(req, res) {
    try {
      const jes = await Je.findAll({
        include: { association: 'member' }
      });
      if (jes.length == 0)
        return res.status(200).json({ msg: 'NOT FOUND' });
      else {
        for (let i = 0; i < jes.length; i++) {
          jes[i].password = undefined;
          for (let j = 0; j < jes[i].member.length; j++)
            jes[i].member[j].password = undefined;
        }
        return res.status(200).json(jes);
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async store(req, res) {
    const { name, email, password, university, image, city, creationYear } = req.body;

    hash = generateHash(password);

    try {
      const je = await Je.create({ name, email, password: hash, university, image, city, creationYear });
      je.password = undefined;
      return res.status(200).json({ je, token: generateToken({ id: je.id }) });
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    try {
      const je = await Je.findByPk(id);
      if (je) {
        je.destroy();
        return res.status(200).json({ msg: 'ok' });
      }
      else
        return res.status(400).json({ msg: 'NOT FOUND' });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async update(req, res) {
    const { id, name, university, image, city, creationYear } = req.body;
    try {
      const je = await Je.findByPk(id);
      if (je) {
        je.update({
          name: name,
          university: university,
          image: image,
          city: city,
          creationYear: creationYear,
        });
        je.password = undefined;
        return res.status(200).json(je);
      }
      else
        return res.status(404).json({ msg: 'NOT FOUND' });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};