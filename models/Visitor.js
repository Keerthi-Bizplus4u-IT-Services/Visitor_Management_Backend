const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(15),
  },
  id_proof_type: {
    type: DataTypes.STRING(50),
  },
  id_proof_number: {
    type: DataTypes.STRING(50),
  },
  photo_path: {
    type: DataTypes.STRING(500),
  },
}, {
  tableName: 'visitors',
  timestamps: true,
  underscored: true,
});

module.exports = Visitor;
