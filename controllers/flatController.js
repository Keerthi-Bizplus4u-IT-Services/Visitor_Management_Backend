const { Flat } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const flats = await Flat.findAll({ order: [['block', 'ASC'], ['flat_number', 'ASC']] });
    res.json(flats);
  } catch (error) {
    console.error('Get flats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const flat = await Flat.findByPk(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json(flat);
  } catch (error) {
    console.error('Get flat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { flat_number, floor, block, owner_name, owner_contact, is_occupied } = req.body;

    if (!flat_number) {
      return res.status(400).json({ message: 'Flat number is required' });
    }

    const flat = await Flat.create({
      flat_number,
      floor: floor || 0,
      block,
      owner_name,
      owner_contact,
      is_occupied: is_occupied !== undefined ? is_occupied : true,
    });

    res.status(201).json(flat);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Flat number already exists in this block' });
    }
    console.error('Create flat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const flat = await Flat.findByPk(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    const { flat_number, floor, block, owner_name, owner_contact, is_occupied } = req.body;
    await flat.update({ flat_number, floor, block, owner_name, owner_contact, is_occupied });

    res.json(flat);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Flat number already exists in this block' });
    }
    console.error('Update flat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const flat = await Flat.findByPk(req.params.id);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    await flat.destroy();
    res.json({ message: 'Flat deleted successfully' });
  } catch (error) {
    console.error('Delete flat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
