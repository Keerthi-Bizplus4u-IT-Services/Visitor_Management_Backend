const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VisitorLog = sequelize.define('VisitorLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING(200),
  },
  entry_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  exit_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  logged_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'visitor_logs',
  timestamps: true,
  underscored: true,
});

module.exports = VisitorLog;
