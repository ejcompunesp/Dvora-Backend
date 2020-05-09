const Feedback = require("../models/Feedback");
const Duty = require("../models/Duty");

module.exports = {
  async store(req, res) {
    const { dutyId } = req.params;

    const { satisfaction, productivity, mood, note, activity } = req.body;

    try {
      const duty = await Duty.findByPk(dutyId);

      if (dutyId == null)
        return res.status(404).json({ error: "DUTY NOT FOUND" });

      //Fazer verificação de status do plantão
      console.log(satisfaction, productivity, mood, note, activity);

      const feedback = await Feedback.create({
        dutyId,
        satisfaction,
        productivity,
        mood,
        note,
        activity,
      });

      return res.status(200).json({ feedback, duty });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "ERROR WHEN REGISTERING ON FEEDBACK" });
    }
  },
};
