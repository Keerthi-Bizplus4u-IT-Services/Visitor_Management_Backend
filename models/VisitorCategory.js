const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VisitorCategory = sequelize.define('VisitorCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(200),
  },
}, {
  tableName: 'visitor_categories',
  timestamps: true,
  underscored: true,
  updatedAt: false,
});

module.exports = VisitorCategory;
