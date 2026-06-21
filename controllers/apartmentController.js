const { ApartmentConfig, Flat } = require('../models');

exports.getConfig = async (req, res) => {
  try {
    let config = await ApartmentConfig.findOne();
    if (!config) {
      config = await ApartmentConfig.create({
        apartment_name: 'My Apartment',
        address: '',
        total_floors: 1,
        contact_number: '',
      });
    }

    const totalFlats = await Flat.count();

    res.json({
      ...config.toJSON(),
      total_flats: totalFlats,
    });
  } catch (error) {
    console.error('Get apartment config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { apartment_name, address, total_floors, contact_number } = req.body;

    let config = await ApartmentConfig.findOne();
    if (!config) {
      config = await ApartmentConfig.create({
        apartment_name,
        address,
        total_floors,
        contact_number,
      });
    } else {
      await config.update({
        apartment_name,
        address,
        total_floors,
        contact_number,
      });
    }

    const totalFlats = await Flat.count();

    res.json({
      ...config.toJSON(),
      total_flats: totalFlats,
    });
  } catch (error) {
    console.error('Update apartment config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
