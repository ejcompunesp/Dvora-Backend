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
      const je = await Je.findByPk(jeId);
      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const members =  await Member.findAll({
        where: { jeId }
      })
      if (members.length == 0)
        return res.status(404).json({ msg: 'NO MEMBER FOUND' })

      je.password = undefined;
      for (let i = 0; i < members.length; i++)
        members[i].password = undefined;
        
      console.log(members)

      return res.status(200).json( { je, members });

    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN GET MEMBER' });
    }
  },

  async store(req, res) {
    const { jeId } = req.params;
    const { email, password, name, board, position, sr, image, dutyDate, dutyTime } = req.body;
    try {
      const je = await Je.findByPk(jeId);

      if (!je)
        return res.status(404).json({ error: 'ENTERPRISE NOT FOUND' });

      je.password = undefined;

      hash = generateHash(password);

      const member = await Member.create({ jeId, email, password: hash, name, board, position, sr, image, dutyDate, dutyTime });
      member.password = undefined;
      return res.status(201).json({ je, member, token: generateToken({ id: member.id }) });
    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN CREATE MEMBER' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (email == null || password == null) 
      return res.status(400).json({ msg: 'EMAIL OR PASSWORD ERROR' })
      
    try {
      let member = await Member.findOne({
        where: { email },
        include: { association: 'je' },
      });
      member = member.dataValues;
      if (member == null)
        return res.status(404).json({ msg: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, member.password);
      if (!ok)
        return res.status(404).json({ msg: 'INCORRECT PASSWORD' });
      else {
        member.password = undefined;
        member.je.password = undefined;
        return res.status(200).json({ member, token: generateToken({ id: member.id }) });
      }
    } catch (error) {
      return res.status(400).json({ msg: 'LOGIN ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    try {
      const member = await Member.findByPk(id);
      if (member) {
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
        return res.status(200).json({ msg: 'MEMBER UPDATED SUCCESSFULLY' });
      }
      else
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ msg: 'MEMBER UPDATE ERROR' });
    }
  },
};