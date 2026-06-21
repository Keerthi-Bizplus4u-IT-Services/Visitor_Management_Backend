const sequelize = require('../config/db');
const User = require('./User');
const ApartmentConfig = require('./ApartmentConfig');
const Flat = require('./Flat');
const VisitorCategory = require('./VisitorCategory');
const Visitor = require('./Visitor');
const VisitorLog = require('./VisitorLog');

// Associations
VisitorLog.belongsTo(Visitor, { foreignKey: 'visitor_id', as: 'visitor' });
VisitorLog.belongsTo(Flat, { foreignKey: 'flat_id', as: 'flat' });
VisitorLog.belongsTo(VisitorCategory, { foreignKey: 'category_id', as: 'category' });
VisitorLog.belongsTo(User, { foreignKey: 'logged_by', as: 'loggedByUser' });

Visitor.hasMany(VisitorLog, { foreignKey: 'visitor_id', as: 'logs' });
Flat.hasMany(VisitorLog, { foreignKey: 'flat_id', as: 'visitorLogs' });
VisitorCategory.hasMany(VisitorLog, { foreignKey: 'category_id', as: 'visitorLogs' });
User.hasMany(VisitorLog, { foreignKey: 'logged_by', as: 'loggedVisits' });

module.exports = {
  sequelize,
  User,
  ApartmentConfig,
  Flat,
  VisitorCategory,
  Visitor,
  VisitorLog,
};
