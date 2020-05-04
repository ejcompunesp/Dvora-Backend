const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const errors = [];

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secretJe, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async index(req, res) {
    try {
      const jes = await Je.findAll();
      if (jes.length == 0)
        return res.status(404).json({ error: 'JE NOT FOUND' });
      else {
        for (let i = 0; i < jes.length; i++) {
          jes[i].password = undefined;
          jes[i].member = undefined;
        }
        return res.status(200).json(jes);
      }
    } catch (error) {
      return res.status(400).json({ error: 'ERROR WHEN GET JES' });
    }
  },

  async store(req, res) {
    const { name, email, password, university, image, city, creationYear } = req.body;
    if (!name || name == null || name == undefined) errors.push({ error: 'NAME IS INVALID' })
    if (!email || email == null || email == undefined) errors.push({ error: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ error: 'PASSWORD IS INVALID' })
    if (!university || university == null || university == undefined) errors.push({ error: 'UNIVERSITY IS INVALID' })
    if (!city || city == null || city == undefined) errors.push({ error: 'CITY IS INVALID' })
    if (!creationYear || creationYear == null || creationYear == undefined) errors.push({ error: 'CREATION YEAR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)
    
    hash = generateHash(password);

    try {
      const je = await Je.create({ name, email, password: hash, university, image, city, creationYear });
      je.password = undefined;
      return res.status(201).json({ je, token: generateToken({ id: je.id }) });
    } catch (error) {
      return res.status(400).json({ error: 'ERROR WHEN CREATE JE' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || email == null || email == undefined || !password || password == null || password == undefined) 
      return res.status(400).json({ error: 'EMAIL OR PASSWORD INVALID' })
      
    try {
      let je = await Je.findOne({
        where: { email },
      });
      je = je.dataValues;
      if (je == null || je === undefined)
        return res.status(404).json({ error: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, je.password);
      if (!ok)
        return res.status(404).json({ error: 'INCORRECT PASSWORD' });
      else {
        je.password = undefined;
        return res.status(200).json({ je, token: generateToken({ id: je.id }) });
      }
    } catch (error) {
      return res.status(400).json({ error: 'LOGIN ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    if (!id || id == null || id == undefined)
      return res.status(400).json({ error: 'JE ID IS INVALID' })

    try {
      const je = await Je.findByPk(id);
      if (je) {
        je.destroy();
        return res.status(200).json({ msg: 'JE DELETED SUCCESSFULLY' });
      }
      else
        return res.status(400).json({ error: 'JE NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ error: 'JE DELETE ERROR' });
    }
  },

  async update(req, res) { 
    const { id, password, name, university, image, city, creationYear } = req.body;
    if (!name || name == null || name == undefined) errors.push({ error: 'NAME IS INVALID' })
    if (!email || email == null || email == undefined) errors.push({ error: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ error: 'PASSWORD IS INVALID' })
    if (!university || university == null || university == undefined) errors.push({ error: 'UNIVERSITY IS INVALID' })
    if (!city || city == null || city == undefined) errors.push({ error: 'CITY IS INVALID' })
    if (!creationYear || creationYear == null || creationYear == undefined) errors.push({ error: 'CREATION YEAR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

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
        return res.status(404).json({ error: 'JE NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ error: 'JE UPDATE ERROR' });
    }
  },
};