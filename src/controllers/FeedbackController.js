const Feedback = require("../models/Feedback");
const Duty = require("../models/Duty");
const Member = require("../models/Member");

module.exports = {
  async index(req, res) {
    const { jeId } = req.body;

    if (!jeId || jeId === null || jeId === undefined)
      return res.status(400).json({ msg: 'JE ID IS INVALID' });

    const vetMembers = [];
    try {
      const now = new Date();
      const sunday = new Date();
      sunday.setDate(sunday.getDate() - sunday.getDay());
      sunday.setHours(0);
      sunday.setMinutes(0);
      sunday.setSeconds(0);

      const members = await Member.findAll({
        where: { jeId: jeId },
        include: [{
          association: 'duties',
          createdAt: { $between: [sunday, now] },
          include: [{ association: 'feedback' }]
        }]
      });

      if (members.length == 0) return res.status(404).json({ msg: "NOT FOUND" });

      members.forEach(member => {
        let ok = true;
        if (member.isDutyDone === 0) { // se o plantao da semana nao foi feito
          vetMembers.push({
            id: member.id,
            name: member.name,
            isDutyDone: false,
            isMonitoringDone: false,
          });
        }
        else {
          member.duties.forEach(duty => {
            if (duty.feedback.isMonitoringDone === 0) { // se o monitoramento de algum plantao nao foi feito 
              vetMembers.push({
                id: member.id,
                name: member.name,
                isDutyDone: true,
                isMonitoringDone: false,
              });
              ok = false;
            }
          });
          if (ok) { // se todos os plantoes foram feitos os monitoramentos
            vetMembers.push({
              id: member.id,
              name: member.name,
              isDutyDone: true,
              isMonitoringDone: true,
            });
          }
        }
      });

      return res.status(200).json(vetMembers);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ERROR WHEN GETTING FEEDBACK" });
    }
  },

  async getMemberDuties(req, res) {
    const { memberId } = req.body;
    try {
      const member = await Member.findByPk(memberId, {
        include: [{
          association: 'duties',
          include: [{ association: 'feedback' }]
        }]
      });

      if (!member)
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });

      member.password = undefined;
      return res.status(200).json(member);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "ERROR WHEN GETTING MEMBER'S DUTIES" });
    }
  },

  async store(req, res) {
    const errors = [];

    const { dutyId } = req.params;

    if (!dutyId || dutyId == null || dutyId == undefined)
      errors.push({ msg: "DUTY ID IS INVALID" });

    const { satisfaction, productivity, mood, note, activity } = req.body;

    if (!satisfaction || satisfaction == null || satisfaction == undefined)
      errors.push({ msg: "SATISFACTION IS INVALID" });
    if (!productivity || productivity == null || productivity == undefined)
      errors.push({ msg: "PRODUCTIVITY IS INVALID" });
    if (!mood || mood == null || mood == undefined)
      errors.push({ msg: "MOOD IS INVALID" });
    if (!activity || activity == null || activity == undefined)
      errors.push({ msg: "ACTIVITY IS INVALID" });
    if (errors.length > 0) return res.status(400).json(errors);

    try {
      const duty = await Duty.findByPk(dutyId);

      if (duty == null)
        return res.status(404).json({ msg: "DUTY NOT FOUND" });

      if (duty.status == 0)
        return res.status(400).json({ msg: "DUTY NOT FINISHED" });

      const feedback = await Feedback.create({
        dutyId: dutyId,
        satisfaction,
        productivity,
        mood,
        note,
        activity,
        isMonitoringDone: 0,
      });

      return res.status(200).json({ feedback, duty });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'FEEDBACK CREATE ERROR' });
    }
  },

  async updateMonitoring(req, res) {
    const { feedbackId } = req.body;

    try {
      const feedback = await Feedback.findByPk(feedbackId);

      if (!feedback)
        return res.status(404).json({ msg: "FEEDBACK NOT FOUND" });

      feedback.update({
        isMonitoringDone: 1,
      });

      return res.status(200).json(feedback);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ERROR WHEN UPDATING MONITORING" });
    }
  },

  async update(req, res) {
    const errors = [];

    const {
      feedbackId,
      satisfaction,
      productivity,
      mood,
      note,
      activity,
    } = req.body;

    if (!satisfaction || satisfaction == null || satisfaction == undefined)
      errors.push({ msg: "SATISFACTION IS INVALID" });
    if (!productivity || productivity == null || productivity == undefined)
      errors.push({ msg: "PRODUCTIVITY IS INVALID" });
    if (!mood || mood == null || mood == undefined)
      errors.push({ msg: "MOOD IS INVALID" });
    if (!activity || activity == null || activity == undefined)
      errors.push({ msg: "ACTIVITY IS INVALID" });
    if (errors.length > 0) return res.status(400).json(errors);

    try {
      const feedback = await Feedback.findByPk(feedbackId);

      if (!feedback)
        return res.status(404).json({ msg: "FEEDBACK NOT FOUND" });

      feedback.update({
        satisfaction: satisfaction,
        productivity: productivity,
        mood: mood,
        note: note,
        activity: activity,
      });

      return res.status(200).json(feedback);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN UPDATING FEEDBACK' });
    }
  },

  async getId(req, res) {
    const { feedbackId } = req.body;
    if (!feedbackId || feedbackId == null || feedbackId == undefined)
      return res.status(400).json({ msg: "FEEDBACK ID IS INVALID" });

    try {
      const feedback = await Feedback.findByPk(feedbackId);

      if (feedback) return res.status(200).json(feedback);
      else return res.status(400).json({ msg: "FEEDBACK NOT FOUND" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN GETTING FEEDBACK' });
    }
  },

  async delete(req, res) {
    const { feedbackId } = req.body;
    if (!feedbackId || feedbackId == null || feedbackId == undefined)
      return res.status(400).json({ msg: "FEEDBACK ID IS INVALID" });

    try {
      const feedback = await Feedback.findByPk(feedbackId);

      if (feedback) {
        feedback.destroy();
        return res.status(200).json({ msg: "FEEDBACK DELETE SUCCESSFULLY" });
      } else return res.status(400).json({ msg: "FEEDBACK NOT FOUND" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "FEEDBACK DELETE ERROR" });
    }
  },
};
