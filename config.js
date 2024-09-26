const { Sequelize } = require('sequelize');
require('dotenv').config();

const toBool = x => x?.toLowerCase() === 'true';
const DATABASE_URL = process.env.DATABASE_URL?.trim() || './db.sqlite3';
const isPostgres = DATABASE_URL.startsWith('postgresql://');

const sequelizeOptions = {
 dialect: isPostgres ? 'postgres' : 'sqlite',
 logging: false,
 ...(isPostgres
  ? {
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
     }
    }
  : { storage: DATABASE_URL })
};

module.exports = {
 DATABASE_URL,
 DATABASE: new Sequelize(DATABASE_URL, null, null, sequelizeOptions),
 SESSION_ID: (process.env.SESSION_ID || '').trim(),
 BOT_INFO: process.env.BOT_NAME || 'Kingbega;Bot;https://i.imgur.com/2X3Fl1l.jpeg',
 SUDO: process.env.SUDO || '255762190568',
 HANDLERS: ['false', 'null'].includes(process.env.HANDLER) ? '^' : '.',
 WELCOME_MSG: process.env.WELCOME_MSG || '',
 GOODBYE_MSG: process.env.GOODBYE_MSG || '',
 AUTO_READ: toBool(process.env.AUTO_READ) || false,
 AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || true,
 STICKER_PACK: process.env.AUTHOR || 'Kingbega;BOT',
 LOGS: toBool(process.env.LOGS) || false,
 WARN_COUNT: 3,
 RMBG_API_KEY: process.env.RMBG_API_KEY || '',
 DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
 DELETED_LOG_CHAT: toBool(process.env.DELETED_LOG_CHAT) || false,
 TIME_ZONE: process.env.TZ,
 BRANCH: 'master',
 WORK_TYPE: process.env.WORK_TYPE || 'private',
 VERSION: require('./package.json').version
};
