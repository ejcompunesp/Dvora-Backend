const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const { promisify } = require('util');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
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
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN GET JES' });
    }
  },

  async store(req, res) {
    const errors = [];

    const { name, email, password, university, image, city, creationYear } = req.body;
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!email || email == null || email == undefined) errors.push({ msg: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ msg: 'PASSWORD IS INVALID' })
    if (!university || university == null || university == undefined) errors.push({ msg: 'UNIVERSITY IS INVALID' })
    if (!city || city == null || city == undefined) errors.push({ msg: 'CITY IS INVALID' })
    if (!creationYear || creationYear == null || creationYear == undefined) errors.push({ msg: 'CREATION YEAR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    hash = generateHash(password);

    try {
      const query = await Je.findOne({ where: { email } });
      if (query) {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', key));
        }
        return res.status(400).json({ msg: 'EMAIL ALREADY REGISTERED' });
      }

      if (req.file) {
        const { key } = req.file;
        const je = await Je.create({ name, email, password: hash, university, image: key, city, creationYear });
        je.password = undefined;
        return res.status(200).json({ je, token: generateToken({ id: je.id, level: 'je' }) });
      }
      else {
        const je = await Je.create({ name, email, password: hash, university, city, creationYear });
        je.password = undefined;
        return res.status(200).json({ je, token: generateToken({ id: je.id, level: 'je' }) });
      }
    } catch (error) {
      if (req.file) {
        const { key } = req.file;
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', key));
      }
      console.log(error);
      return res.status(500).json({ msg: 'JE REGISTRATION ERROR' });
    }
  },

  async delete(req, res) {
    if (req.level !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });
    try {
      const je = await Je.findByPk(req.id);
      if (je) {
        if (je.image)
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', je.image));
        je.destroy();
        return res.status(200).json({ msg: 'JE DELETED SUCCESSFULLY' });
      }
      else
        return res.status(400).json({ msg: 'JE NOT FOUND' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'JE DELETE ERROR' });
    }
  },

  async update(req, res) {
    const errors = [];

    const { password, name, university, city, creationYear } = req.body;
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!university || university == null || university == undefined) errors.push({ msg: 'UNIVERSITY IS INVALID' })
    if (!city || city == null || city == undefined) errors.push({ msg: 'CITY IS INVALID' })
    if (!creationYear || creationYear == null || creationYear == undefined) errors.push({ msg: 'CREATION YEAR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    if (req.level !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });

    let hash;
    if (password)
      hash = generateHash(password);

    try {
      const je = await Je.findByPk(req.id);
      if (je) {
        if (req.file) {
          const { key } = req.file;
          if (je.image)
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', je.image));
          await je.update({
            name: name,
            password: hash,
            university: university,
            image: key,
            city: city,
            creationYear: creationYear,
          });
        }
        else {
          await je.update({
            name: name,
            password: hash,
            university: university,
            city: city,
            creationYear: creationYear,
          });
        }
        je.password = undefined;
        return res.status(200).json(je);
      }
      else {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', key));
        }
        return res.status(404).json({ msg: 'NOT FOUND' });
      }
    } catch (error) {
      if (req.file) {
        const { key } = req.file;
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', key));
      }
      console.log(error);
      return res.status(500).json({ msg: 'JE UPDATE ERROR' });
    }
  },
};