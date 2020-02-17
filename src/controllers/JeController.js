const Je = require('../models/Je');
const bcrypt = require('bcrypt');

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
    const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    password = generateHash(password);

    try {
      const je = await Je.create({ name, email, password, university, image, creationYear });
      return res.status(200).json(je);
    } catch (je) {
      return res.status(400).json({ msg: 'Erro nos dados inseridos' })
    }
  },

  async login(req, res) {
    let { email, password } = req.body;
    const validPassword = (password, hash) => bcrypt.compareSync(password, hash);
    try {
      const je = await Je.findOne({
        where: { email },
      })
      if (je.length == 0)
        return res.status(200).json({ msg: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, je.password);
      if (ok)
        return res.status(200).json({ msg: 'OK' });
      else
        return res.status(200).json({ msg: 'INCORRECT PASSWORD' });
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR' });
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