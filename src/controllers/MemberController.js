const Member = require('../models/Member');
const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JE_LEVEL, MEMBER_LEVEL } = require('../config/token');
const authConfig = require('../config/auth');

const { promisify } = require('util');
const { profile } = require('console');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

setInterval(async () => {
  const now = new Date();
  if (now.getDay() === 0) { //se eh domingo
    try {
      const member = await Member.findAll();
      if (member.length != 0) {
        for (i = 0; i < member.length; i++) {
          if (member[i].isDutyDone == 1)
            member[i].update({ isDutyDone: 0 });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}, 86400); //um dia

module.exports = {
  async index(req, res) {

    const { jeId } = req.params;
    if (!jeId || jeId == undefined || jeId == null)
      return res.status(400).json({ msg: 'JE ID IS INVALID' })

    try {
      const je = await Je.findByPk(jeId);
      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const members = await Member.findAll({
        where: { jeId },
        include: { association: 'board' }
      })
      if (members.length == 0)
        return res.status(404).json({ msg: 'NO MEMBER FOUND' })

      je.password = undefined;
      for (let i = 0; i < members.length; i++)
        members[i].password = undefined;


      return res.status(200).json({ je, members });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN GET MEMBER' });
    }
  },

  async store(req, res) {
    const errors = [];

    const { email, password, name, boardId, position, sr } = req.body;

    if (!email || email == null || email == undefined) errors.push({ msg: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ msg: 'PASSWORD IS INVALID' })
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ msg: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    if (req.level !== JE_LEVEL)
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });

    try {
      const je = await Je.findByPk(req.id);

      if (!je) {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
        }
        return res.status(400).json({ msg: 'ENTERPRISE NOT FOUND' });
      }

      const query = await Member.findOne({ where: { email } });
      if (query || je.email == email) {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
        }
        return res.status(400).json({ msg: 'EMAIL ALREADY REGISTERED' });
      }

      const hash = generateHash(password);

      if (req.file) {
        const { key } = req.file;
        const member = await Member.create({ jeId: req.id, name, email, password: hash, boardId, position, sr, image: key, isDutyDone: 0 });
        je.password = undefined;
        member.password = undefined;
        return res.status(200).json({ je, member, token: generateToken({ id: member.id, level: 'member' }) });
      }
      else {
        const member = await Member.create({ jeId: req.id, name, email, password: hash, boardId, position, sr, isDutyDone: 0 });
        je.password = undefined;
        member.password = undefined;
        return res.status(200).json({ je, member, token: generateToken({ id: member.id, level: 'member' }) });
      }
    } catch (error) {
      if (req.file) {
        const { key } = req.file;
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
      }
      console.log(error);
      return res.status(500).json({ msg: 'MEMBER REGISTRATION ERROR' });
    }
  },

  async delete(req, res) {
    const { memberId } = req.body

    if (req.level !== JE_LEVEL)
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });

    try {
      const member = await Member.findByPk(memberId);
      if (member) {
        if (member.image)
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', member.image));
        member.destroy();
        return res.status(200).json({ msg: 'MEMBER DELETED SUCCESSFULLY' });
      }
      else
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'MEMBER DELETE ERROR' });
    }
  },

  async update(req, res) {
    const errors = []

    const { id, name, boardId, password, position, sr, isDutyDone } = req.body;
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!boardId || boardId == null || boardId == undefined) errors.push({ msg: 'BOARD ID IS INVALID' })
    if (!position || position == null || position == undefined) errors.push({ msg: 'POSITION IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ msg: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    if (req.level !== JE_LEVEL)
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });

    let hash;
    if (password)
      hash = generateHash(password);

    try {
      const member = await Member.findByPk(id);
      if (member) {
        if (req.file) {
          const { key } = req.file;
          if (member.image)
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', member.image));
          await member.update({
            name: name,
            boardId: boardId,
            boardId: hash,
            position: position,
            sr: sr,
            image: key,
            isDutyDone: parseInt(isDutyDone),
          });
        }
        else
          await member.update({
            name: name,
            boardId: boardId,
            boardId: hash,
            position: position,
            sr: sr,
            isDutyDone: parseInt(isDutyDone),
          });
        member.password = undefined;
        return res.status(200).json(member);
      }
      else {
        if (req.file) {
          const { key } = req.file;
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
        }
        return res.status(404).json({ msg: 'NOT FOUND' });
      }
    } catch (error) {
      if (req.file) {
        const { key } = req.file;
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
      }
      console.log(error);
      return res.status(500).json({ msg: 'MEMBER UPDATE ERROR' });
    }
  },
};