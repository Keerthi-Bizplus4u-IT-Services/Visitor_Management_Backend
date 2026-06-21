const { Visitor, VisitorLog, Flat, VisitorCategory } = require('../models');
const path = require('path');
const fs = require('fs');

exports.create = async (req, res) => {
  try {
    const { name, contact, id_proof_type, id_proof_number, flat_id, category_id, purpose, remarks } = req.body;

    if (!name || !flat_id || !category_id) {
      return res.status(400).json({ message: 'Name, flat, and category are required' });
    }

    // Handle base64 webcam photo
    let photo_path = null;
    if (req.body.photo) {
      const base64Data = req.body.photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.jpg`;
      const filepath = path.join(__dirname, '..', 'uploads', filename);
      fs.writeFileSync(filepath, buffer);
      photo_path = filename;
    } else if (req.file) {
      photo_path = req.file.filename;
    }

    const visitor = await Visitor.create({
      name,
      contact,
      id_proof_type,
      id_proof_number,
      photo_path,
    });

    const visitorLog = await VisitorLog.create({
      visitor_id: visitor.id,
      flat_id: parseInt(flat_id),
      category_id: parseInt(category_id),
      purpose,
      entry_time: new Date(),
      logged_by: req.user ? req.user.id : null,
      remarks,
    });

    const log = await VisitorLog.findByPk(visitorLog.id, {
      include: [
        { association: 'visitor' },
        { association: 'flat' },
        { association: 'category' },
      ],
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Create visitor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({
      order: [['created_at', 'DESC']],
      limit: 100,
    });
    res.json(visitors);
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const visitor = await Visitor.findByPk(req.params.id, {
      include: [{ association: 'logs', include: ['flat', 'category'] }],
    });
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
