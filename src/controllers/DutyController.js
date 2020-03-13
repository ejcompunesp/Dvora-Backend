const Duty = require('../models/Duty');
const Member = require('../models/Member');
const Je = require('../models/Je');

module.exports = {
  async index(req, res) {
    const { memberId } = req.params
    const { dutyId } = req.body;
    try {
      const member = Member.findByPk(memberId, {
        include: { association: 'duty' },
      });
      member.password = undefined;
      return res.status(200).json(member);
    } catch (error) {
      return res.status(400).json(error)
    }
  },

  async store(req, res) {
    const { jeId } = req.params;
    const { email, password, name, board, position, sr, image } = req.body;
    try {
      const je = await Je.findByPk(jeId);

      if (!je)
        return res.status(400).json({ error: 'ENTERPRISE NOT FOUND' });

      je.password = undefined;

      hash = generateHash(password);

      const member = await Member.create({ jeId, email, password: hash, name, board, position, sr, image });
      member.password = undefined;
      return res.status(200).json({ je, member, token: generateToken({ id: member.id }) });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};