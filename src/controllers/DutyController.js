const Duty = require('../models/Duty');
const Member = require('../models/Member');

const Moment = require('moment')
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

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
      return res.status(400).json({ msg: 'ERROR WHEN GET DUTIES' })
    }
  },

  async store(req, res) {
    const { email, password } = req.body;
  
    try {
      const member = await Member.findOne({ 
        where: {email}
      });

      if (member == null) return res.status(404).json({ error: 'EMAIL NOT FOUND' })

      const duty = await Duty.create({
        memberId: member.id,
        status: 0,
        elapsedTime: 0
      })

      return res.status(201).json({ member, duty })
      
    } catch (error) {
      return res.status(400).json({msg: 'ERROR WHEN REGISTERING ON DUTY' });
    }
  },

  async update(req, res) {
    const { dutyId } = req.params;

    const dutyAct = await Duty.findByPk(dutyId)

    const end = moment()
    const start = moment(dutyAct.createdAt)
    const elapsedTime = moment.range(start, end).diff('seconds')
    
    try {
      const duty = await Duty.findByPk(dutyId)

      duty.update({
        status: 1,
        elapsedTime
      })

      if (duty) {
        return res.status(200).json(duty)
      }
      else
        return res.status(404).json({ msg: 'NOT FOUND' });

    } catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN ENDING DUTY' });
    }
  },

};