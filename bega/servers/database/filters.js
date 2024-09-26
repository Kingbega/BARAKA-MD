const config = require('../../../config');
const { DataTypes } = require('sequelize');

const FiltersDB = config.DATABASE.define('filters', {
 chat: {
  type: DataTypes.STRING,
  allowNull: false
 },
 pattern: {
  type: DataTypes.TEXT,
  allowNull: false
 },
 text: {
  type: DataTypes.TEXT,
  allowNull: false
 },
 regex: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
 }
});

async function getFilter(jid = null, filter = null) {
 const whereClause = { chat: jid };
 if (filter !== null) {
  whereClause.pattern = filter;
 }
 const filters = await FiltersDB.findAll({
  where: whereClause
 });

 return filters.length > 0 ? filters : false;
}

async function setFilter(jid = null, filter = null, tex = null, regx = false) {
 const existingFilter = await FiltersDB.findOne({
  where: {
   chat: jid,
   pattern: filter
  }
 });

 if (!existingFilter) {
  return await FiltersDB.create({
   chat: jid,
   pattern: filter,
   text: tex,
   regex: regx
  });
 } else {
  return await existingFilter.update({
   chat: jid,
   pattern: filter,
   text: tex,
   regex: regx
  });
 }
}

async function deleteFilter(jid = null, filter) {
 const existingFilter = await FiltersDB.findOne({
  where: {
   chat: jid,
   pattern: filter
  }
 });

 if (!existingFilter) {
  return false;
 } else {
  return await existingFilter.destroy();
 }
}

module.exports = {
 FiltersDB,
 getFilter,
 setFilter,
 deleteFilter
};
