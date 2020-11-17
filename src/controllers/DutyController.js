const Duty = require('../models/Duty');
const Member = require('../models/Member');
const Je = require('../models/Je')

const Moment = require('moment')
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const { JE_LEVEL, MEMBER_LEVEL } = require('../config/token');

const bcrypt = require('bcrypt');
const validPassword = (password, hash) => bcrypt.compareSync(password, hash);

const { Op } = require('sequelize');

module.exports = {
  async index(req, res) {

    const { memberId } = req.params
    if (!memberId || memberId == null || memberId == undefined)
      return res.status(400).json({ msg: 'MEMBER ID IS INVALID' })

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
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN GET DUTIES' })
    }
  },

  async consult(req, res) {

    const { jeId } = req.params
    if (!jeId || jeId == null || jeId == undefined)
      return res.status(400).json({ msg: 'JE ID IS INVALID' })

    try {
      const je = await Je.findByPk(jeId)
      if (!je) return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const startToday = new Date();
      const endToday = new Date();

      startToday.setHours(0);
      startToday.setMinutes(0);
      startToday.setSeconds(0);

      endToday.setHours(23);
      endToday.setMinutes(59);
      endToday.setSeconds(59);

      const members = await Member.findAll({
        attributes: ['name'],
        where: {
          jeId
        },
        include: {
          association: 'duties',
          where: {
            [Op.or]: [
              { createdAt: { [Op.between]: [startToday, endToday] } },
              { status: 0 }
            ]
          }
        }
      });

      const dutiesToday = [];
      members.forEach(member => {
        for (let i = 0; i < member.duties.length; i++)
          dutiesToday.push({ member: member.name, duty: member.duties[i] });
      });

      if (dutiesToday.length === 0)
        return res.status(404).json({ msg: 'NOT FOUND' });

      return res.status(200).json({ dutiesToday });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN GET DUTIES' })
    }
  },

  async store(req, res) {
    if (req.level === JE_LEVEL) {

      const { email, password } = req.body;
      if (!email || email == null || email == undefined || !password || password == null || password == undefined)
        return res.status(400).json({ msg: 'EMAIL OR PASSWORD IS INVALID' })

      try {
        const member = await Member.findOne({
          where: { email }
        });

        if (!member)
          return res.status(404).json({ msg: 'EMAIL NOT FOUND' })

        if (member.jeId !== req.id)
          return res.status(400).json({ msg: 'NOT A MEMBER OF THE LOGGED JE' });

        if (!validPassword(password, member.password))
          return res.status(401).json({ msg: 'INCORRECT PASSWORD' });

        const dutyIfExist = await Duty.findAll({
          where: { memberId: member.id, status: 0 }
        })
        if (dutyIfExist.length)
          return res.status(409).json({ msg: 'DUTY ALREADY STARTED' })


        const duty = await Duty.create({
          memberId: member.id,
          status: 0,
          elapsedTime: 0
        })
        member.password = undefined;

        return res.status(200).json({ member, duty })

      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN REGISTERING ON DUTY' });
      }
    }
    else if (req.level === MEMBER_LEVEL) {
      try {
        const dutyIfExist = await Duty.findAll({
          where: { memberId: req.id, status: 0 }
        });
        if (dutyIfExist.length)
          return res.status(409).json({ msg: 'DUTY ALREADY STARTED' });

        const duty = await Duty.create({
          memberId: req.id,
          status: 0,
          elapsedTime: 0
        });

        const member = await Member.findByPk(req.id);
        member.password = undefined;

        return res.status(200).json({ member, duty });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN REGISTERING ON DUTY' });
      }
    }
    else {
      return res.status(401).json({ msg: 'TOKEN INVALID' });
    }
  },

  async update(req, res) {
    if (req.level === JE_LEVEL) {
      const { id, password } = req.body;

      if (!id || id === null || id === undefined || !password || password === null || password === undefined)
        return res.status(400).json({ msg: 'ID OR PASSWORD IS INVALID' });

      try {
        const member = await Member.findByPk(id, {
          where: { jeId: req.id },
          include: {
            association: 'duties',
            required: false,
            where: { status: 0 }
          }
        });

        if (!member)
          return res.status(404).json({ msg: 'MEMBER NOT FOUND' });

        if (member.duties.length === 0)
          return res.status(404).json({ msg: 'NOT FOUND A STARTED DUTY' });

        if (!validPassword(password, member.password))
          return res.status(401).json({ msg: 'INCORRECT PASSWORD' });

        const duty = await Duty.findByPk(member.duties[0].id);

        const end = moment();
        const start = moment(duty.createdAt);
        const elapsedTime = moment.range(start, end).diff('seconds');

        await duty.update({
          status: 1,
          elapsedTime
        })

        await member.update({
          isDutyDone: 1
        })

        return res.status(200).json(duty);

      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN ENDING DUTY' });
      }
    }
    else if (req.level === MEMBER_LEVEL) {

      try {
        const member = await Member.findByPk(req.id, {
          include: [{
            association: 'duties',
            required: false,
            where: { status: 0 }
          }]
        });

        if (member.duties.length === 0)
          return res.status(404).json({ msg: 'NOT FOUND A STARTED DUTY' });

        const duty = await Duty.findByPk(member.duties[0].id);

        const end = moment();
        const start = moment(duty.createdAt);
        const elapsedTime = moment.range(start, end).diff('seconds');

        await duty.update({
          status: 1,
          elapsedTime
        })

        await member.update({
          isDutyDone: 1
        })

        return res.status(200).json(duty);

      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN ENDING DUTY' });
      }
    }
    else {
      return res.status(401).json({ msg: 'TOKEN INVALID' });
    }
  },

  async delete(req, res) {
    const { dutyId } = req.body

    if (!dutyId || dutyId == null || dutyId == undefined)
      return res.status(400).json({ msg: 'DUTY ID IS INVALID' })

    if (req.level !== JE_LEVEL)
      return res.status(401).json({ msg: 'NOT A JE TOKEN' })

    try {
      const duty = await Duty.findByPk(dutyId)
      if (duty){
        duty.destroy()
        return res.status(200).json({ msg: 'DUTY DELETED SUCCESSFULLY' })
      }
      return res.status(404).json({ msg: 'DUTY NOT FOUND' })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN DELETE DUTIES' })
    } 
  }

};