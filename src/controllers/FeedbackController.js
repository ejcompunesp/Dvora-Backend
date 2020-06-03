const Feedback = require("../models/Feedback");
const Duty = require("../models/Duty");
const Member = require("../models/Member");

module.exports = {
  async index(req, res) {
    try {
      const query = await Member.findAll({
        attributes: ["name"],
        include: [
          {
            association: "duties",
            attributes: ["elapsedTime"],
            include: [
              {
                association: "feedback",
                attributes: ["id"],
              },
            ],
          },
        ],
      });
      if (!query) return res.status(404).json({ msg: "NOT FOUND" });

      return res.status(200).json(query);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ERROR WHEN GETTING FEEDBACK" });
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
      });

      return res.status(200).json({ feedback, duty });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'FEEDBACK CREATE ERROR' });
    }
  },

  async updateMonitoring(req, res) {
    const { monitoring, feedbackId } = req.body;

    if (!monitoring || monitoring == null || monitoring == undefined)
      errors.push({ msg: "MONITORING IS INVALID" });

    try {
      const feedback = await Feedback.findByPk(feedbackId);

      if (!feedback)
        return res.status(404).json({ msg: "FEEDBACK NOT FOUND" });

      feedback.update({
        monitoring: monitoring,
      });

      return res.status(200).json(feedback);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ERROR WHEN REGISTERING MONITORING" });
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
    console.log(req.body);

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
