const Project = require('../models/Project');
const Je = require('../models/Je');
const Member = require('../models/Member');

module.exports = {
  async index(req, res) {
    const { jeId } = req.params;

    try {
      const je = await Je.findByPk(jeId, {
        include: { association: 'project' },
      });

      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' });

      if (je.project.length == 0)
        return res.status(404).json({ msg: 'NO PROJECT FOUND' });

      je.password = undefined;
      return res.status(200).json(je);
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async store(req, res) {
    const { jeId } = req.params;
    const { name, details, value, startDate, deliveryDate } = req.body;

    try {
      const je = await Je.findByPk(jeId);

      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' });

      const project = await Project.create({ jeId, name, details, value, startDate, deliveryDate });
      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async update(req, res) {
    const { name, details, value, startDate, deliveryDate } = req.body;
    const { jeId, projectId } = req.params;
    try {
      const project = await Project.findByPk(projectId);
      if (!project)
        return res.status(404).json({ msg: 'PROJECT NOT FOUND' });
      await project.update({
        name: name,
        details: details,
        value: value,
        startDate: startDate,
        deliveryDate: deliveryDate,
      });
      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async delete(req, res) {
    const { projectId } = req.params;
    try {
      const project = await Project.findByPk(projectId);
      if (!project)
        return res.status(404).json({ msg: 'PROJECT NOT FOUND' });
      project.destroy();
      return res.status(200).json({ msg: 'OK' });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async addMember(req, res) {
    const { jeId, projectId } = req.params;
    const { memberId } = req.body;

    try {
      const je = await Je.findByPk(jeId);
      if (!je)
        return res.status(404).json({ msg: 'ENTERPRISE NOT FOUND' });

      const project = await Project.findByPk(projectId);
      if (!project)
        return res.status(404).json({ msg: 'PROJECT NOT FOUND' });

      const member = await Member.findByPk(memberId);
      if (!member)
        return res.status(404).json({ msg: 'MEMBER NOT FOUND' });

      await project.addMember(member);
      member.password = undefined;
      return res.status(200).json({ member, project });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}