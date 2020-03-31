const Duty = require('../models/Duty');
const Member = require('../models/Member');

module.exports = {
  async index(req, res) {
    const { memberId } = req.params
    
    try {
      const member = await Member.findByPk(memberId, {
        include: { association: 'duties' },
      });

      if (!member)
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' })
      member.password = undefined;

      if (member.duties.length == 0) return res.status(404).json({ msg: 'NO DUTIES FOUND' }) 

      return res.status(200).json({ member });
    } catch (error) {
      return res.status(400).json(error)
    }
  },

  async store(req, res) {
    const { memberId } = req.params;
  
    try {
      const member = await Member.findByPk(memberId);
      if (!member) return res.status(400).json({ error: 'MEMBER NOT FOUND' })

      const duty = await Duty.create({
        memberId,
        status: 'InProgress',
        updatedAt: null,
      })
      console.log({ member, duty })

      return res.status(200).json({ member, duty })
      
      // const [duty] = await Duty.findOrCreate({
      //   where: { createdAt },
      //   defaults: { status: 'InProgress' }
      // });

      // await member.addDuty(duty);
      // member.password = undefined;
      // return res.status(200).json({ member, duty });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async update(req, res) {
    const { memberId } = req.params;
    
    try {
      const member = await Member.findByPk(memberId, {
        include: { association: 'duties' },
      });
      
      for (let i=0; i<member.duties.length; i++) {
        if (member.duties[i].status == 'InProgress') member.duties[i].status = 'Concluded'
      }
      res.status(200).json({ member })

    } catch (error) {
      return res.status(400).json(error);
    }
  },
};