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
    const { memberId } = req.params;
    const { createdAt } = req.body;
    try {
      const member = Member.findByPk(memberId);

      const [duty] = await Duty.findOrCreate({
        where: { createdAt },
      });

      await member.addDuty(duty);

      return res.status(200).json(duty);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};