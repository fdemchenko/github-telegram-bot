const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tg_user_id: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  gh_username: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

module.exports = { User };




