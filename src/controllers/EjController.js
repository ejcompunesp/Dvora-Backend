const Ej = require('../models/Ej')


module.exports = {
  async index(req, res) {
    const allEj = await Ej.findAll();

    return res.json(allEj);
  },

  async store(req, res) {
    const { name, university, image, creationYear } = req.body;

    const ej = await Ej.create({ name, university, image, creationYear });

    return res.json(ej);
  }
};