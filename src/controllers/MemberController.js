const Member = require('../models/Member');
const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secretMember, {
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
        return res.status(404).json({ msg: 'NO MEMBER FOUND' })

      je.password = undefined;
      let member = je.member;
      je.dataValues.member = undefined;
      for (let i = 0; i < member.length; i++)
        member[i].password = undefined;

      return res.status(200).json({ je, member });

    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async store(req, res) {
    const { jeId } = req.params;
    const { email, password, name, board, position, sr, image, dutyDate, dutyTime } = req.body;
    try {
      const je = await Je.findByPk(jeId);

      if (!je)
        return res.status(400).json({ error: 'ENTERPRISE NOT FOUND' });

      je.password = undefined;

      hash = generateHash(password);

      const member = await Member.create({ jeId, email, password: hash, name, board, position, sr, image, dutyDate, dutyTime });
      member.password = undefined;
      return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    try {
      const member = await Member.findByPk(id);
      if (member) {
        member.destroy();
        return res.status(200).json({ msg: 'ok' });
      }
      else
        return res.status(400).json({ msg: 'NOT FOUND' });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async update(req, res) {
    const { id, name, board, password, position, sr, image, dutyDate, dutyTime } = req.body;
    try {
      const member = await Member.findByPk(id);
      if (member) {
        member.update({
          name: name,
          password: password,
          board: board,
          position: position,
          sr: sr,
          image: image,
          dutyDate: dutyDate,
          dutyTime: dutyTime,
        });
        member.password = undefined;
        return res.status(200).json(member);
      }
      else
        return res.status(404).json({ msg: 'NOT FOUND' });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};