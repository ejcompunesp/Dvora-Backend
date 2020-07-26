const Board = require('../models/Board')
const Je = require('../models/Je')

module.exports = {
  async index(req, res) {
    if (req.level !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' });
    try {
      const boards = await Board.findAll({
        where: { jeId: req.id }
      })
      if (boards) return res.status(200).json({ boards })
      return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })
    }
    catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN GET BOARDS' })
    }
  },


  async store(req, res) {
    const { name } = req.body
    if (!name || name == null || name == undefined) return res.status(400).json({ msg: 'BOARD NAME IS INVALID' })

    if (req.leve !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' })

    try {
      const je = await Je.findByPk(req.id)
      if (!je) return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const board = await Board.create({
        jeId: je.id,
        name
      })
      if (board) return res.status(200).json({ board })
    }
    catch (error) {
      return res.status(400).json({ msg: 'ERROR WHEN REGISTERING THE BOARD' });
    }

  },

  async delete(req, res) {
    if (req.level !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' })

    const { boardId } = req.body
    if (!boardId || boardId == null || boardId == undefined)
      return res.status(400).json({ msg: 'BOARD ID IS INVALID' })

    try {
      const je = await Je.findByPk(req.id)
      if (!je) return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const board = await Board.findByPk(boardId)
      if (board) {
        board.destroy()
        return res.status(200).json({ msg: 'BOARD DELETED SUCCESSFULLY' });
      }
      return res.status(404).json({ msg: 'BOARD NOT FOUND' })
    }
    catch (error) {
      return res.status(400).json({ msg: 'BOARD DELETE ERROR' });
    }
  },

  async update(req, res) {
    if (req.leve !== 'je')
      return res.status(401).json({ msg: 'NOT A JE TOKEN' })

    const { boardId, name } = req.body
    if (!name || name == null || name == undefined) return res.status(400).json({ msg: 'BOARD NAME IS INVALID' })

    try {
      const je = await Je.findByPk(req.id)
      if (!je) return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' })

      const board = await Board.findByPk(boardId)
      if (board) {
        board.update({ name })
        return res.status(200).json({ board })
      }
      return res.status(404).json({ msg: 'BOARD NOT FOUND' });
    }
    catch (error) {
      return res.status(400).json({ msg: 'BOARD UPDATE ERROR' });
    }
  }
}
