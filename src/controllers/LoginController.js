const Je = require('../models/Je');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
const validPassword = (password, hash) => bcrypt.compareSync(password, hash);

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      let je = await Je.findOne({ where: { email } });
      if (je) {
        je = je.dataValues
        let ok = validPassword(password, je.password);
        if (!ok)
          return res.status(400).json({ msg: 'INCORRECT PASSWORD' });
        else {
          je.password = undefined;
          return res.status(200).json({ je, token: generateToken({ id: je.id }) });
        }
      }
      else {
        let je = await Je.findOne({
          include: [{
            association: 'member',
            where: { email: email }
          }],
        });
        je = je.dataValues;
        member = je.member[0].dataValues;
        je.member = undefined;
        let ok = validPassword(password, member.password);
        console.log(ok);
        if (!ok)
          return res.status(400).json({ msg: 'INCORRECT PASSWORD' });

        member.password = undefined;
        je.password = undefined;

        return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};