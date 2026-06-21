require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, VisitorCategory, ApartmentConfig } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ alter: true });
    console.log('Tables synced.');

    // Seed admin user
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        full_name: 'System Admin',
        role: 'admin',
      });
      console.log('Admin user created (username: admin, password: admin123)');
    } else {
      console.log('Admin user already exists, skipping.');
    }

    // Seed security user
    const existingSecurity = await User.findOne({ where: { username: 'security' } });
    if (!existingSecurity) {
      const hashedPassword = await bcrypt.hash('security123', 10);
      await User.create({
        username: 'security',
        password: hashedPassword,
        full_name: 'Security Guard',
        role: 'security',
      });
      console.log('Security user created (username: security, password: security123)');
    } else {
      console.log('Security user already exists, skipping.');
    }

    // Seed visitor categories
    const categories = [
      { name: 'Delivery', description: 'Package delivery, food delivery, courier services' },
      { name: 'Guests', description: 'Personal guests, family members, friends' },
      { name: 'Others', description: 'Maintenance workers, vendors, unknown visitors' },
    ];

    for (const cat of categories) {
      const existing = await VisitorCategory.findOne({ where: { name: cat.name } });
      if (!existing) {
        await VisitorCategory.create(cat);
        console.log(`Category '${cat.name}' created.`);
      }
    }

    // Seed apartment config
    const existingConfig = await ApartmentConfig.findOne();
    if (!existingConfig) {
      await ApartmentConfig.create({
        apartment_name: 'My Apartment',
        address: '123 Main Street, City',
        total_floors: 5,
        contact_number: '9876543210',
      });
      console.log('Apartment config created.');
    }

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
