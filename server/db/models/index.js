const User = require('./user');
const Score = require('./score');

Score.belongsTo(User);
User.hasMany(Score);

module.exports = {
  User,
  Score,
};
