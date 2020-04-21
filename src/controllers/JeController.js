const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secretJe, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async index(req, res) {
    try {
      const jes = await Je.findAll();
      if (jes.length == 0)
        return res.status(404).json({ msg: 'JE NOT FOUND' });
      else {
        for (let i = 0; i < jes.length; i++) {
          jes[i].password = undefined;
          jes[i].member = undefined;
        }
        return res.status(200).json(jes);
      }
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN GET JE' });
    }
  },

  async store(req, res) {
    const { name, email, password, university, image, city, creationYear } = req.body;

    hash = generateHash(password);

    try {
      const je = await Je.create({ name, email, password: hash, university, image, city, creationYear });
      je.password = undefined;
      return res.status(201).json({ je, token: generateToken({ id: je.id }) });
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN CREATE JE' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      let je = await Je.findOne({
        where: { email },
      });
      je = je.dataValues;
      if (je == null)
        return res.status(404).json({ msg: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, je.password);
      if (!ok)
        return res.status(404).json({ msg: 'INCORRECT PASSWORD' });
      else {
        je.password = undefined;
        return res.status(200).json({ je, token: generateToken({ id: je.id }) });
      }
    } catch (error) {
      return res.status(400).json({ msg: 'LOGIN ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    try {
      const je = await Je.findByPk(id);
      if (je) {
        je.destroy();
        return res.status(200).json({ msg: 'JE DELETED SUCCESSFULLY' });
      }
      else
        return res.status(400).json({ msg: 'JE NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ msg: 'JE DELETE ERROR' });
    }
  },

  async update(req, res) {
    const { id, password, name, university, image, city, creationYear } = req.body;
    try {
      const je = await Je.findByPk(id);
      if (je) {
        je.update({
          name: name,
          password: password,
          university: university,
          image: image,
          city: city,
          creationYear: creationYear,
        });
        return res.status(200).json({ msg: 'JE UPDATED SUCCESSFULLY' });
      }
      else
        return res.status(404).json({ msg: 'JE NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ msg: 'JE UPDATE ERROR' });
    }
  },
};