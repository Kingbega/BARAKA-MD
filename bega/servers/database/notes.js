const config = require('../../../config');
const { DataTypes } = require('sequelize');

const NotesDB = config.DATABASE.define('notes', {
 note: {
  type: DataTypes.TEXT,
  allowNull: false
 }
});

async function getNotes() {
 return await NotesDB.findAll();
}

async function saveNote(note) {
 return await NotesDB.create({ note });
}

async function deleteAllNotes() {
 return await NotesDB.destroy({
  where: {},
  truncate: true
 });
}

module.exports = {
 NotesDB,
 getNotes,
 saveNote,
 deleteAllNotes
};
