const Duty = require('../models/Duty');
const Member = require('../models/Member');

module.exports = {
  async index(req, res) {
    const { memberId } = req.params
    const { dutyId } = req.body;
    try {
      const member = await Member.findByPk(memberId, {
        include: { association: 'duties' },
      });

      if (!member)
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' })

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
      const member = await Member.findByPk(memberId);

      const [duty] = await Duty.findOrCreate({
        where: { createdAt },
        defaults: { status: 'InProgress' }
      });

      await member.addDuty(duty);
      member.password = undefined;
      return res.status(200).json({ member, duty });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};