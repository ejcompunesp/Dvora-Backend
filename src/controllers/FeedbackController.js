const Feedback = require("../models/Feedback");
const Duty = require("../models/Duty");

const errors = [];

module.exports = {
  async store(req, res) {
    const { dutyId } = req.params;

    const { satisfaction, productivity, mood, note, activity } = req.body;

    if (!satisfaction || satisfaction == null || satisfaction == undefined) errors.push({ error: 'SATISFACTION IS INVALID' });
    if (!productivity || productivity == null || productivity == undefined) errors.push({ error: 'PRODUCTIVITY IS INVALID' });
    if (!mood || mood == null || mood == undefined) errors.push({ error: 'MOOD IS INVALID' });
    if (!activity || activity == null || activity == undefined) errors.push({ error: 'ACTIVITY IS INVALID' });
    if (errors.length > 0) return res.status(400).json(errors);

    try {
      const duty = await Duty.findByPk(dutyId);

      if (duty == null)
        return res.status(404).json({ error: "DUTY NOT FOUND" });

      if (duty.status == 0)
        return res.status(400).json({ error: 'DUTY NOT FINISHED' });

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
      return res.status(400).json({ error });
    }
  },
};
