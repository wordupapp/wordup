const Sequelize = require('sequelize');
const db = require('../../db');

const Score = db.define('score', {
  score: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Score;
