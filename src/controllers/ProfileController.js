const { JE_LEVEL, MEMBER_LEVEL } = require('../config/token');
const Member = require('../models/Member');

module.exports = {
  async profile(req, res) {
    if (req.level === JE_LEVEL) {
      const { memberId } = req.params;
      if (!memberId || memberId === null || memberId === undefined)
        return res.status(400).json({ msg: 'MEMBER ID IS INVALID' });
      try {
        const member = await Member.findByPk(memberId, {
          include: [{
            association: 'duties',
          },
          {
            association: 'board',
          }]
        });

        if (!member)
          return res.status(404).json({ msg: 'MEMBER NOT FOUND' });
        if (member.jeId !== req.id)
          return res.status(401).json({ msg: 'NOT A MEMBER OF THE LOGGED JE' });

        return res.status(200).json({
          name: member.name,
          board: member.board.name,
          duties: member.duties,
          description: member.description,
          img: member.image,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN GETTING MEMBER PROFILE' });
      }
    }
    else if (req.level === MEMBER_LEVEL) {
      try {
        const member = await Member.findByPk(req.id, {
          include: [{
            association: 'duties',
          },
          {
            association: 'board'
          }],
        });

        if (!member)
          return res.status(404).json({ msg: 'MEMBER NOT FOUND' });

        return res.status(200).json({
          name: member.name,
          board: member.board.name,
          duties: member.duties,
          description: member.description,
          img: member.image,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'ERROR WHEN GETTING PROFILE' });
      }
    }
  },
}