const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Flat = sequelize.define('Flat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  flat_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  block: {
    type: DataTypes.STRING(10),
  },
  owner_name: {
    type: DataTypes.STRING(100),
  },
  owner_contact: {
    type: DataTypes.STRING(15),
  },
  is_occupied: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'flats',
  timestamps: true,
  underscored: true,
});

module.exports = Flat;
