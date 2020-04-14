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
    const { email, password, name, board, position, sr, dutyDate, dutyTime } = req.body;
    try {
      const je = await Je.findByPk(jeId);

      if (!je)
        return res.status(400).json({ error: 'ENTERPRISE NOT FOUND' });

      je.password = undefined;

      hash = generateHash(password);
      if (req.file) {
        const { key } = req.file;
        const member = await Member.create({ jeId, email, password: hash, name, board, position, sr, image: key, dutyDate, dutyTime });
      }
      else
        const member = await Member.create({ jeId, email, password: hash, name, board, position, sr, dutyDate, dutyTime });
      member.password = undefined;
      return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      let je = await Je.findOne({
        include: [{
          association: 'member',
          where: { email: email }
        }],
      });

      je = je.dataValues;
      member = je.member[0].dataValues;
      je.member = undefined;

      if (member == null)
        return res.status(400).json({ msg: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, member.password);
      if (!ok)
        return res.status(400).json({ msg: 'INCORRECT PASSWORD' });

      member.password = undefined;
      je.password = undefined;

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
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', member.image));
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
    const { id, name, board, position, sr, dutyDate, dutyTime } = req.body;
    try {
      const member = await Member.findByPk(id);
      if (member) {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'je', member.image));
          member.update({
            name: name,
            board: board,
            position: position,
            sr: sr,
            image: key,
            dutyDate: dutyDate,
            dutyTime: dutyTime,
          });
        }
        else
          member.update({
            name: name,
            board: board,
            position: position,
            sr: sr,
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