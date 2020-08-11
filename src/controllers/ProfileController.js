const { JE_LEVEL, MEMBER_LEVEL } = require('../config/token');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

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

  async update(req, res) {
    if (req.level !== MEMBER_LEVEL)
      return res.status(401).json({ msg: 'NOT A MEMBER TOKEN' });

    const errors = [];

    const { name, boardId, password, position, sr, description } = req.body;
    let key;
    if (req.file)
      key = req.file.key;
    if (!name || name == null || name == undefined) errors.push({ msg: 'NAME IS INVALID' })
    if (!boardId || boardId == null || boardId == undefined) errors.push({ msg: 'BOARD ID IS INVALID' })
    if (!position || position == null || position == undefined) errors.push({ msg: 'POSITION IS INVALID' })
    if (!sr || sr == null || sr == undefined) errors.push({ msg: 'SR IS INVALID' })
    if (!description || description == null || description == undefined) errors.push({ msg: 'DESCRIPTION IS INVALID' })
    if (errors.length > 0) {
      if (req.file)
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
      return res.status(400).json(errors)
    }

    try {
      const member = await Member.findByPk(req.id);

      if (!member) {
        if (req.file)
          promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });
      }

      let hash;
      if (password)
        hash = generateHash(password);

      await member.update({ name, boardId, position, sr, description, password: hash, image: key });

      member.password = undefined;
      return res.status(200).json(member);

    } catch (error) {
      if (req.file)
        promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'public', 'uploads', 'member', key));
      console.log(error);
      return res.status(500).json({ msg: 'ERROR WHEN UPDATING PROFILE' });
    }
  }
}