const Je = require('../models/Je');
const bcrypt = require('bcrypt');

module.exports = {
  async index(req, res) {
    // try {
    //   const allJe = await Je.findAll();
    //   return res.json(allJe);
    // } catch (error) {
    //   return res.status(404).json(error);
    // }
    const allJe = await Je.findAll();
    console.log(allJe);
    if (allJe.length == 0)
      return res.status(404).json({ msg: 'NOT FOUND' });
    else
      return res.json(allJe);
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

    // static validPassword = (password, hash) => bcrypt.compareSync(password, hash);
  }
};