const Member = require('../models/Member');
const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const errors = []

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secretMember, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async index(req, res) {

    const { jeId } = req.params;
    if (!jeId || jeId == undefined || jeId == null)
      return res.status(400).json({ error: 'JE ID IS INVALID' })

    try {
      const je = await Je.findByPk(jeId);
      if (!je)
        return res.status(404).json({ error: 'ENTERPRISE NOT FOUND' })

      const members =  await Member.findAll({
        where: { jeId }
      })
      if (members.length == 0)
        return res.status(404).json({ error: 'NO MEMBER FOUND' })

      je.password = undefined;
      for (let i = 0; i < members.length; i++)
        members[i].password = undefined;
        
      console.log(members)

      return res.status(200).json( { je, members });

    } catch (error) {
      return res.status(400).json({ error: 'ERROR WHEN GET MEMBER' });
    }
  },

  async store(req, res) {  //AQUI
    const { jeId } = req.params;
    if (!jeId || jeId == null || jeId == undefined) errors.push({ error: 'JE ID IS INVALID' })
    const { email, password, name, board, position, sr, image, dutyDate, dutyTime } = req.body;
    if (!email || email == null || email == undefined) errors.push({ error: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ error: 'PASSWORD IS INVALID' })
    if (!name || name == null || name == undefined) errors.push({ error: 'NAME IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ error: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

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
      return res.status(400).json({ error: 'ERROR WHEN CREATE MEMBER' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password || email == null || password == null || email == undefined || password == undefined) 
      return res.status(400).json({ error: 'EMAIL OR PASSWORD IS INVALID' })
      
    try {
      let member = await Member.findOne({
        where: { email },
        include: { association: 'je' },
      });
      member = member.dataValues;
      if (member == null)
        return res.status(404).json({ error: 'EMAIL NOT FOUND' });
      let ok = validPassword(password, member.password);
      if (!ok)
        return res.status(404).json({ error: 'INCORRECT PASSWORD' });
      else {
        member.password = undefined;
        member.je.password = undefined;
        return res.status(200).json({ member, token: generateToken({ id: member.id }) });
      }
    } catch (error) {
      return res.status(400).json({ error: 'LOGIN ERROR' });
    }
  },

  async delete(req, res) {
    const { id } = req.body;
    if (!id || id == null || id == undefined)
      return res.status(400).json({ error: 'MEMBER ID IS INVALID' })

    try {
      const member = await Member.findByPk(id);
      if (member) {
        member.destroy();
        return res.status(200).json({ msg: 'MEMBER DELETED SUCCESSFULLY' });
      }
      else
        return res.status(404).json({ error: 'MEMBER NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ error: 'MEMBER DELETE ERROR' });
    }
  },

  async update(req, res) { //AQUI
    const { id, name, board, password, position, sr, image, dutyDate, dutyTime } = req.body;
    if (!email || email == null || email == undefined) errors.push({ error: 'EMAIL IS INVALID' })
    if (!password || password == null || password == undefined) errors.push({ error: 'PASSWORD IS INVALID' })
    if (!name || name == null || name == undefined) errors.push({ error: 'NAME IS INVALID' })
    if (!board || board == null || board == undefined) errors.push({ error: 'BOARD IS INVALID' })
    if (!position || position == null || position == undefined) errors.push({ error: 'POSITION IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ error: 'SR IS INVALID' })
    if (errors.length > 0) return res.status(400).json(errors)

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
        return res.status(404).json({ error: 'MEMBER NOT FOUND' });
    } catch (error) {
      return res.status(400).json({ error: 'MEMBER UPDATE ERROR' });
    }
  },
};