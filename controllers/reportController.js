const { Op, fn, col, literal } = require('sequelize');
const { VisitorLog, Visitor, Flat, VisitorCategory } = require('../models');

exports.getByFlat = async (req, res) => {
  try {
    const { flatId } = req.params;
    const { date_from, date_to } = req.query;

    const where = { flat_id: flatId };

    if (date_from || date_to) {
      where.entry_time = {};
      if (date_from) where.entry_time[Op.gte] = new Date(date_from);
      if (date_to) {
        const endDate = new Date(date_to);
        endDate.setHours(23, 59, 59, 999);
        where.entry_time[Op.lte] = endDate;
      }
    }

    const flat = await Flat.findByPk(flatId);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    const logs = await VisitorLog.findAll({
      where,
      include: [
        { association: 'visitor', attributes: ['id', 'name', 'contact', 'photo_path'] },
        { association: 'category', attributes: ['id', 'name'] },
      ],
      order: [['entry_time', 'DESC']],
    });

    res.json({
      flat,
      total_visitors: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Report by flat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Today's visitors
    const todayCount = await VisitorLog.count({
      where: { entry_time: { [Op.gte]: today, [Op.lt]: tomorrow } },
    });

    // This week's visitors
    const weekCount = await VisitorLog.count({
      where: { entry_time: { [Op.gte]: weekAgo } },
    });

    // This month's visitors
    const monthCount = await VisitorLog.count({
      where: { entry_time: { [Op.gte]: monthAgo } },
    });

    // Total visitors ever
    const totalCount = await VisitorLog.count();

    // Active visitors (entered but not exited)
    const activeCount = await VisitorLog.count({
      where: { exit_time: null },
    });

    // Active visitor details
    const activeVisitors = await VisitorLog.findAll({
      where: { exit_time: null },
      include: [
        { association: 'visitor', attributes: ['id', 'name', 'contact', 'photo_path'] },
        { association: 'flat', attributes: ['id', 'flat_number', 'block'] },
        { association: 'category', attributes: ['id', 'name'] },
      ],
      order: [['entry_time', 'DESC']],
    });

    // Category breakdown (today)
    const categoryBreakdown = await VisitorLog.findAll({
      where: { entry_time: { [Op.gte]: today, [Op.lt]: tomorrow } },
      attributes: [
        'category_id',
        [fn('COUNT', col('VisitorLog.id')), 'count'],
      ],
      include: [
        { association: 'category', attributes: ['name'] },
      ],
      group: ['category_id', 'category.id', 'category.name'],
      raw: true,
      nest: true,
    });

    // Total flats
    const totalFlats = await Flat.count();

    res.json({
      today: todayCount,
      this_week: weekCount,
      this_month: monthCount,
      total: totalCount,
      active: activeCount,
      active_visitors: activeVisitors,
      category_breakdown: categoryBreakdown,
      total_flats: totalFlats,
    });
  } catch (error) {
    console.error('Report summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
