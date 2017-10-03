const router = require('express').Router();
const { User } = require('../db/models');
const { graphDb } = require('../db');

const session = graphDb.session();

module.exports = router;

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next);
});

router.get('/:id/words', (req, res, next) => {
  const userId = req.params.id;
  const cypherCode = `
    MATCH (user:User {pgId: ${userId}})
      -[r:USED]
      ->(words:Word)
    RETURN words.name,words.level,r.times
  `;
  session.run(cypherCode)
    .then(data => data.records)
    .then(words => {
      const wordData = words.map(word => word._fields);
      res.json(wordData);
    })
    .catch(next);
});

router.post('/:id/words', (req, res, next) => {
  const userId = req.params.id;
  const newWords = req.body;
  const newWordPromiseArr = [];

  newWords.forEach(newWord => {
    const cypherCode = `
      MATCH (user:User {pgId: ${userId}})
      MERGE (word:Word {name: '${newWord}'})
      MERGE (user)-[r:USED]->(word)
      ON CREATE SET r.times = 1
      ON MATCH SET r.times = r.times + 1
      RETURN word.name,word.level,r.times
    `;
    newWordPromiseArr.push(session.run(cypherCode));
  });

  Promise.all(newWordPromiseArr)
    .then(data => {
      const wordData = data.map(wordDatum => wordDatum.records[0]._fields);
      res.json(wordData);
    })
    .catch(next);
});
