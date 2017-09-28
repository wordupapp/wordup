const db = require('./db');
const graphDb = require('./graphDb');

// register models
require('./models');

module.exports = {
  db,
  graphDb,
};
