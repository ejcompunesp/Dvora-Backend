const Je = require('../models/Je')


module.exports = {
  async index(req, res) {
    const allJe = await Je.findAll();

    return res.json(allJe);
  },

  async store(req, res) {
    const { name, university, image, creationYear } = req.body;

    const je = await Je.create({ name, university, image, creationYear });

    return res.json(je);
  }
};