const router = require('express').Router();
const unirest = require('unirest');
const promiseRetry = require('promise-retry');

const { User } = require('../db/models');
const { graphDb } = require('../db');
const stopWords = require('../../public/assets/json/stopwords.json');

const session = graphDb.session();

module.exports = router;

router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'email'],
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

/* -----------  Helper functions to Twinword APIs get word details ----------- */

const getLevel = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-language-scoring.p.mashape.com/word/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) resolve(result.body.ten_degree);
        else reject(`Failed to get level for: ${wordName}`);
      });
  });
};

const getDefinition = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/definition/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) resolve(result.body.meaning);
        else reject(`Failed to get definitions for: ${wordName}`);
      });
  });
};

const getExample = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/example/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) resolve(result.body.example);
        else reject(`Failed to get examples for: ${wordName}`);
      });
  });
};

const getRelation = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/reference/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) resolve(result.body.relation);
        else reject(`Failed to get relations for: ${wordName}`);
      });
  });
};

const retryCallsToApi = (getDetail, wordName) => {
  return promiseRetry(function (retry, number) {
      console.log('Attempt number to Twinword API:', number);

      return getDetail(wordName)
        .catch(retry);
  })
}

const getWordDetailFromApi = async (wordName) => {

  const wordData = { name: wordName };

  const level = await retryCallsToApi(getLevel, wordName);
  const meaning = await retryCallsToApi(getDefinition, wordName);
  const examples = await retryCallsToApi(getExample, wordName);
  const relations = await retryCallsToApi(getRelation, wordName);

  wordData.level = level;
  wordData.definitions = meaning;
  wordData.examples = examples;
  wordData.relations = relations;

  return wordData;
};

router.post('/:id/words', (req, res, next) => {
  const userId = req.params.id;
  const newWords = req.body;
  const newWordPromiseArr = [];

  newWords.forEach(async newWord => {

    let newWordData ={};

    if (stopWords[newWord]) {
      // If new word is a stop word, assign level 0 and dont' call APIs
      newWordData.name = newWord;
      newWordData.level = 0;
    } else {
      newWordData = await getWordDetailFromApi(newWord);
    }

    console.log('newWordData', newWordData);

    const cypherCode = `
      MATCH (user:User {pgId: ${userId}})
      MERGE (word:Word {name: '${newWord}'})
      ON CREATE SET word.level = ${newWordData.level}
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
