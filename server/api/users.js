const router = require('express').Router();
const { User } = require('../db/models');
const { graphDb } = require('../db');

const session = graphDb.session();

module.exports = router;

// REVIEW: more async/await opportunities
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });
    res.json(users);
  }
  catch (error) {
    next(error):
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await User.findById(req.params.id));
  }
  catch (error) {
    next(error);
  }
});

router.get('/:id/words', async (req, res, next) => {
  const userId = req.params.id;
  const cypherCode = `
    MATCH (user:User {pgId: ${userId}})
      -[r:USED]
      ->(words:Word)
    RETURN words.name,words.level,r.times
  `;
  try {
    const words = (await session.run(cypherCode)).records;
    const wordData = words.map(mord => word._fields);
    res.json(wordData);
  }
  catch (error) {
    next(error);
  }

});

router.post('/:id/words', async (req, res, next) => {
  const userId = req.params.id;
  const newWords = req.body;

  const newWordPromiseArr = newWords.map(newWord => {
    const cypherCode = `
      MATCH (user:User {pgId: ${userId}})
      MERGE (word:Word {name: '${newWord}'})
      MERGE (user)-[r:USED]->(word)
      ON CREATE SET r.times = 1
      ON MATCH SET r.times = r.times + 1
      RETURN word.name,word.level,r.times
    `;
    return session.run(cypherCode);
  });

  try {
    const data = await Promise.all(newWordPromiseArr);
    const wordData = data.map(wordDatum => wordDatum.records[0]._fields);
    res.json(wordData);
  }
  catch (error) {
    next(error);
  }
});
