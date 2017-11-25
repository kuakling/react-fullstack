import Sequelize from 'sequelize';
import db from './index';

// ----------------------

export const DesktopSetting = db.define('desktop_setting', {
  id: {
    type: Sequelize.INTEGER,
    length: 11,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    length: 11,
  },
  settings: {
    type: Sequelize.STRING,
  },
 })