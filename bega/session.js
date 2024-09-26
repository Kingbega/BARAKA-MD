const config = require("../config");
const {
  DataTypes
} = require("sequelize");
const sessionDB = config.DATABASE.define("store-session-json", {
  'prekey': {
    'type': DataTypes.STRING,
    'allowNull': false
  },
  'session_id': {
    'type': DataTypes.STRING,
    'allowNull': false
  },
  'session': {
    'type': DataTypes.TEXT,
    'allowNull': false
  }
});
exports.setSession = async (_0x65de39, _0x28de2e, _0x2eba02) => {
  const _0x152ae7 = await sessionDB.findAll({
    'where': {
      'prekey': _0x28de2e,
      'session_id': _0x2eba02
    }
  });
  return _0x152ae7.length < 1 ? (await sessionDB.create({
    'prekey': _0x28de2e,
    'session_id': _0x2eba02,
    'session': _0x65de39
  }), true) : (await _0x152ae7[0].update({
    'session': _0x65de39
  }), true);
};
exports.getSession = async (_0x5881cb, _0x6e3466) => {
  const _0x9636e6 = await sessionDB.findAll({
    'where': {
      'prekey': _0x5881cb,
      'session_id': _0x6e3466
    }
  });
  return _0x9636e6.length < 1 ? false : _0x9636e6[0].dataValues.session;
};
exports.delSession = async (_0x5bafd0, _0x4b10cb) => {
  const _0xb5bb00 = await sessionDB.findAll({
    'where': {
      'prekey': _0x5bafd0,
      'session_id': _0x4b10cb
    }
  });
  return _0xb5bb00.length < 1 ? false : await _0xb5bb00[0].destroy();
};