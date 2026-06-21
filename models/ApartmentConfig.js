const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ApartmentConfig = sequelize.define('ApartmentConfig', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  apartment_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  total_floors: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  contact_number: {
    type: DataTypes.STRING(15),
  },
}, {
  tableName: 'apartment_config',
  timestamps: true,
  underscored: true,
});

module.exports = ApartmentConfig;
