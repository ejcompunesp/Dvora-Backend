const Member = require('../models/Member');
const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const { promisify } = require('util');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secretMember, {
  expiresIn: 86400, //um dia
});

setInterval(async () => {
  try {
    const member = await Member.findAll();
    if (member.length != 0) {
      for (i = 0; i < member.length; i++) {
        if (member[0].isDutyDone == 1)
          member[i].update({ isDutyDone: 0 });
      }
    }
  } catch (error) {
    console.log(error);
  }
}, 604800000); //uma semana

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
        where: { jeId }
      })
      if (members.length == 0)
        return res.status(404).json({ msg: 'NO MEMBER FOUND' })

      je.password = undefined;
      for (let i = 0; i < members.length; i++)
        members[i].password = undefined;


      return res.status(200).json({ je, members });

    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN GET MEMBER' });
    }
  },

  async store(req, res) {
    const errors = [];

    const { jeId } = req.params;
    if (!jeId || jeId == null || jeId == undefined) errors.push({ msg: 'JE ID IS INVALID' })
    const { email, password, name, board, position, sr, dutyDate, dutyTime } = req.body;
    if (!email || email == null || email == undefined) errors.push({ msg: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ msg: 'PASSWORD IS INVALID' })
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ msg: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    try {
      const je = await Je.findByPk(jeId);

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
        const member = await Member.create({ jeId, name, email, password: hash, board, position, sr, image: key, isDutyDone: 0 });
        je.password = undefined;
        member.password = undefined;
        return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
      }
      else {
        const member = await Member.create({ jeId, name, email, password: hash, board, position, sr, isDutyDone: 0 });
        je.password = undefined;
        member.password = undefined;
        return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
      }
    } catch (error) {
      if (req.file) {
        const { key } = req.file;
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
      }
      console.log({error})
      return res.status(400).json({ msg: 'MEMBER REGISTRATION ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    if (!id || id == null || id == undefined)
      return res.status(400).json({ msg: 'MEMBER ID IS INVALID' })

    try {
      const member = await Member.findByPk(id);
      if (member) {
        if (member.image)
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', member.image));
        member.destroy();
        return res.status(200).json({ msg: 'MEMBER DELETED SUCCESSFULLY' });
      }
      else
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ msg: 'MEMBER DELETE ERROR' });
    }
  },

  async update(req, res) {
    const errors = []

    const { id, name, board, password, position, sr, dutyDate, dutyTime, isDutyDone } = req.body;
    if (!password || password == null || password == undefined) errors.push({ msg: 'PASSWORD IS INVALID' })
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!board || board == null || board == undefined) errors.push({ msg: 'BOARD IS INVALID' })
    if (!position || position == null || position == undefined) errors.push({ msg: 'POSITION IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ msg: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

    try {
      const member = await Member.findByPk(id);
      if (member) {
        if (req.file) {
          const { key } = req.file;
          if (member.image)
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', member.image));
          member.update({
            name: name,
            board: board,
            position: position,
            sr: sr,
            image: key,
            isDutyDone: parseInt(isDutyDone),
          });
        }
        else
          member.update({
            name: name,
            board: board,
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
      return res.status(400).json({ msg: 'MEMBER UPDATE ERROR' });
    }
  },
};