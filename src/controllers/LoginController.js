const Je = require('../models/Je');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const validPassword = (password, hash) => bcrypt.compareSync(password, hash);

const generateTokenMember = (params = {}) => jwt.sign(params, authConfig.secretMember, {
  expiresIn: 86400, //um dia
});

const generateTokenJe = (params = {}) => jwt.sign(params, authConfig.secretJe, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password || email == null || password == null || email == undefined || password == undefined)
      return res.status(400).json({ error: 'EMAIL OR PASSWORD IS INVALID' })
    try {
      let je = await Je.findOne({ where: { email } });
      if (je) {
        je = je.dataValues
        let ok = validPassword(password, je.password);
        if (!ok)
          return res.status(400).json({ msg: 'INCORRECT PASSWORD' });
        else {
          je.password = undefined;
          return res.status(200).json({ je, token: generateTokenJe({ id: je.id }) });
        }
      }
      else {
        let je = await Je.findOne({
          include: [{
            association: 'members',
            where: { email: email }
          }],
        });
        if (!je)
          return res.status(404).json({ error: 'EMAIL NOT FOUND' });
        member = je.members[0];
        je.dataValues.members = undefined;
        let ok = validPassword(password, member.password);
        if (!ok)
          return res.status(400).json({ msg: 'INCORRECT PASSWORD' });

        member.password = undefined;
        je.password = undefined;

        return res.status(200).json({ je, member, token: generateTokenMember({ id: member.id }) });
      }
    } catch (error) {
      return res.status(400).json({ error: 'ERROR WHEN LOGGING IN' });
    }
  }
};