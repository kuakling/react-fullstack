import Sequelize from 'sequelize';
import db from './index';

// ----------------------

export const UserProfile = db.define('user_profile', {
  user_id: {
    type: Sequelize.INTEGER,
    length: 11,
    autoIncrement: true,
    primaryKey: true,
  },
  firstname: {
    type: Sequelize.STRING,
    len: 255,
  },
  lastname: {
    type: Sequelize.STRING,
    len: 255,
  },
  avatar_offset: {
    type: Sequelize.STRING,
    len: 255,
  },
  avatar_cropped: {
    type: Sequelize.STRING,
    len: 255,
  },
  avatar: {
    type: Sequelize.STRING,
    len: 255,
  },
  cover_offset: {
    type: Sequelize.STRING,
    len: 255,
  },
  cover_cropped: {
    type: Sequelize.STRING,
    len: 255,
  },
  cover: {
    type: Sequelize.STRING,
    len: 255,
  },
  bio: {
    type: Sequelize.STRING,
    len: 255,
  },
 })