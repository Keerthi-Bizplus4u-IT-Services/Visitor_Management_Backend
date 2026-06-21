const { Op } = require('sequelize');
const { VisitorLog, Visitor, Flat, VisitorCategory, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { flat_id, category_id, date_from, date_to, active_only } = req.query;

    const where = {};

    if (flat_id) where.flat_id = flat_id;
    if (category_id) where.category_id = category_id;

    if (active_only === 'true') {
      where.exit_time = null;
    }

    if (date_from || date_to) {
      where.entry_time = {};
      if (date_from) where.entry_time[Op.gte] = new Date(date_from);
      if (date_to) {
        const endDate = new Date(date_to);
        endDate.setHours(23, 59, 59, 999);
        where.entry_time[Op.lte] = endDate;
      }
    }

    const logs = await VisitorLog.findAll({
      where,
      include: [
        { association: 'visitor', attributes: ['id', 'name', 'contact', 'photo_path'] },
        { association: 'flat', attributes: ['id', 'flat_number', 'block'] },
        { association: 'category', attributes: ['id', 'name'] },
        { association: 'loggedByUser', attributes: ['id', 'full_name'] },
      ],
      order: [['entry_time', 'DESC']],
      limit: 500,
    });

    res.json(logs);
  } catch (error) {
    console.error('Get visitor logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markExit = async (req, res) => {
  try {
    const log = await VisitorLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: 'Visitor log not found' });

    if (log.exit_time) {
      return res.status(400).json({ message: 'Visitor has already exited' });
    }

    await log.update({
      exit_time: new Date(),
      remarks: req.body.remarks || log.remarks,
    });

    const updated = await VisitorLog.findByPk(log.id, {
      include: [
        { association: 'visitor' },
        { association: 'flat' },
        { association: 'category' },
      ],
    });

    res.json(updated);
  } catch (error) {
    console.error('Mark exit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await VisitorCategory.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
