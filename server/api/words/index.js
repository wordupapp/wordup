const router = require('express').Router();
const Promise = require('bluebird');
const { graphDb } = require('../../db');

const session = graphDb.session();

// Get new random vocab word in next level
router.get('/related/:level/', (req, res, next) => {
  const level = +req.params.level;
  const cypherCodeForCount = `
    MATCH (n:Word {level: ${level}})
    RETURN count(*)
  `;
  session.run(cypherCodeForCount)
    .then(data => data.records)
    .then(count => {
      const numWords = count[0]._fields[0].low;
      return numWords;
    })
    .then(numWords => {
      const randomNumber = Math.floor(Math.random() * ((numWords - 1)));
      const cypherCodeForWord = `
        MATCH (n:Word {level: ${level}})
        RETURN n
        SKIP ${randomNumber}
        LIMIT 1
      `;
      return session.run(cypherCodeForWord);
    })
    .then(data => data.records[0]._fields[0].properties.name)
    .then(randomWord => {
      const cypherCodeForRelatedWords = `
        MATCH (word:Word {name: "${randomWord}"})
        -[r:RELATEDTO]
        ->(words:RelatedWords)
        RETURN words.text,r.relation
      `;
      return Promise.all([randomWord, session.run(cypherCodeForRelatedWords)]);
    })
    .then(([randomWord, data]) => {
      if (!data.records.length) {
        res.send('No results. Retry');
      } else {
        const finalWords = data.records.map(word => word._fields);
        res.json({ randomWord, finalWords });
      }
    })
    .catch(next);
});

// GET all definitions for a specific level
router.get('/definitions/:level', (req, res, next) => {
  const level = +req.params.level;
  const cypherQuery = `
    MATCH (n:Word)-[:DEFINITION]->(m:Definition)
    WHERE n.level = ${level}
    RETURN n.intId, n.name, m.text;
  `;
  session.run(cypherQuery)
    .then(data => data.records)
    .then(records => {
      const wordsAndDefinitions = records.map(record => {
        const id = record._fields[0].low;
        const word = record._fields[1];
        const meaning = record._fields[2].split('\n');
        return { id, word, meaning };
      });
      res.send(wordsAndDefinitions);
    })
    .catch(next);
});

module.exports = router;
