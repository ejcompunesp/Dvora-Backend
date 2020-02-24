const Member = require('../models/Member');
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
    const { jeId } = req.params;
    try {
      const je = await Je.findByPk(jeId, {
        include: { association: 'member' },
      });
      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      if (je.member.length == 0)
        return res.status(404).json({ msg: 'NO MEMBER FOUNDED' })

      return res.status(200).json(je);

    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async store(req, res) {
    const { jeId } = req.params;
    let { email, password, name, board, position, sr, image } = req.body;
    try {
      const je = await Je.findByPk(jeId);

      password = generateHash(password);

      if (!je)
        return res.status(400).json({ error: 'ENTERPRISE NOT FOUND' });

      const member = await Member.create({ jeId, email, password, name, board, position, sr, image });
      member.password = undefined;
      return res.status(200).json(member);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};