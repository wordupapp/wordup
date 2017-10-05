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

router.get('/:id/words/suggest/:level', (req, res, next) => {
  const userId = req.params.id;
  const userLevel = +req.params.level;
  const level = userLevel === 10 ? userLevel : userLevel+1;
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

      // Get random words that user have not spoken for certain level

      if (numWords < 1) return null;
      const randomNumber = Math.floor(Math.random() * ((numWords - 1)));
      const cypherCodeForWord = `
        MATCH (user:User {pgId: ${userId}})
        MATCH (word:Word {level: ${level}})
          WHERE NOT ((user)-[:USED]-(word))
        RETURN word
        SKIP ${randomNumber}
        LIMIT 9
      `;
      return session.run(cypherCodeForWord);
    })
    .then(data => data.records)
    .then(randWordArr => {

      // Get random words' definitions

      const wordNameArr = randWordArr.map(wordData => {
        return wordData._fields[0].properties.name;
      })
      const getDefPromiseArr = wordNameArr.map(wordName =>
       {
        //TODO: DEFINITON -> DEFINITION
        const cypherCode = `
          MATCH (word:Word {name: "${wordName}"})
          MATCH (word)-[r:DEFINITON]
            ->(def:Definition)
          RETURN r.partOfSpeech, def.text
        `;
        return session.run(cypherCode)
      })
      return Promise.all([wordNameArr, Promise.all(getDefPromiseArr)]);
    })
    .then(([wordNameArr, wordDefDataArr]) => {

      // Get random words' examples

      const wordDefArr = wordDefDataArr.map(wordData => {
        return wordData.records.map(record => ({
          pos: record._fields[0],
          text: record._fields[1]
        }));
      })

      const getExamplePromiseArr = wordNameArr.map(wordName =>
       {
        //TODO: Example -> EXAMPLE
        const cypherCode = `
          MATCH (word:Word {name: "${wordName}"})
          MATCH (word)-[:Example]
            ->(ex:Example)
          RETURN ex.text
        `;
        return session.run(cypherCode)
      })

      return Promise.all([wordNameArr, wordDefArr, Promise.all(getExamplePromiseArr)]);
    })
    .then(([wordNameArr, wordDefArr, wordExampleDataArr]) => {

      // Get random words' realtions

      const wordExampleArr = wordExampleDataArr.map(wordData => {
        return wordData.records.map(record => record._fields[0]);
      })

      const getRelationPromiseArr = wordNameArr.map(wordName =>
       {
        const cypherCode = `
          MATCH (word:Word {name: "${wordName}"})
          MATCH (word)-[r:RELATEDTO]
            ->(relWords:RelatedWords)
          RETURN r.relation, relWords.text
         `;
        return session.run(cypherCode)
      })

      return Promise.all([wordNameArr, wordDefArr,wordExampleArr, Promise.all(getRelationPromiseArr)]);
    })
    .then(([wordNameArr, wordDefArr, wordExampleArr, wordRelationDataArr]) => {

      // Combine word detail arrays into a single array

      const wordRelationArr = wordRelationDataArr.map(wordData => {
        return wordData.records.map(record => ({
          type: record._fields[0],
          text: record._fields[1]
        }));
      });

      const retArr = [];
      for (let i = 0; i < wordNameArr.length; i++) {
        retArr.push({
          name: wordNameArr[i],
          definitions: wordDefArr[i],
          examples: wordExampleArr[i],
          realtions: wordRelationArr[i],
        })
      }
      return retArr;
    })
    .then(data => res.json(data))
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
      if (number > 1) console.log('Retry attempt to Twinword API:', number);
      return getDetail(wordName)
        .catch(retry);
  })
}

const wordInDb = (wordName) => {
  const cypherCode = `
    MATCH (word:Word {name: '${wordName}'})
    RETURN word
  `
  return session.run(cypherCode)
    .then(data => data.records)
    .then(words => words[0] ? words[0] : null)
    .catch(console.error);
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

const cypherCodeForNewWord = (userId, wordData) => {

  const { name, level, definitions, examples, relations } = wordData;
  let definitionIndex = 0;
  let exampleIndex = 0;
  let relationIndex = 0;

  // Merge for User & Word
  let cypherCode = `
    MATCH (user:User {pgId: ${userId}})
    MERGE (word:Word {name: '${name}'})
      ON CREATE SET word.level = ${level}
      ON MATCH SET word.level = ${level}
    MERGE (user)-[r:USED]->(word)
      ON CREATE SET r.times = 1
      ON MATCH SET r.times = r.times + 1
  `;

  // Create relationships to definitions
  if (definitions){
    Object.keys(definitions).forEach(pos => {
      const defText = definitions[pos];
      if (defText.length > 0) {
        definitionIndex += 1;
        cypherCode += `
          CREATE (def${definitionIndex}:Definition
            {text: "${defText}"}),
          (word)
            -[:DEFINITON {partOfSpeech: "${pos}"}]
            ->(def${definitionIndex})
          `;
      }
    });
  }

  // Create relationships to examples
  if (examples) {
    examples.forEach(example => {
      if (example.length > 0) {
        exampleIndex += 1;
        cypherCode += `
          CREATE (example${exampleIndex}:Example
            {text: "${example}"}),
          (word)
            -[:Example]
            ->(example${exampleIndex})`;
      }
    });
  }

  // Create relationships to related words
  if (relations) {
    Object.keys(relations).forEach(relation => {
      const relationText = relations[relation];
      if (relationText.length > 0) {
        relationIndex += 1;
        cypherCode += `
          CREATE (relation${relationIndex}:RelatedWords
            {text: "${relationText}"}),
          (word)
            -[:RELATEDTO {relation: "${relation}"}]
            ->(relation${relationIndex})`;
      }
    });
  }

  cypherCode += `
    RETURN word.name,word.level,r.times
    `;

  return cypherCode;
}

/* --------------------------------------------------------------------------- */

router.post('/:id/words', (req, res, next) => {
  const userId = req.params.id;
  const newWords = req.body;

  const newWordPromiseArr = newWords.map(async newWord => {

    let newWordData ={};

    if (stopWords[newWord]) {
      // If new word is a stop word, assign level 0 and dont' call APIs
      newWordData.name = newWord;
      newWordData.level = 0;
    } else {
      const  wordStoredInDb = await wordInDb(newWord);
      if (wordStoredInDb) {
        const level = wordStoredInDb._fields[0].properties.level.low;
        newWordData.name = newWord;
        newWordData.level = level;
      } else {
        // only call api to get word detail if word is neither stop word
        // nor in database already
        newWordData = await getWordDetailFromApi(newWord);
      }
    }

    const cypherCode = cypherCodeForNewWord(userId, newWordData);

    return session.run(cypherCode);
  });

  Promise.all(newWordPromiseArr)
    .then(data => {
      const wordData = data.map(wordDatum => wordDatum.records[0]._fields);
      res.json(wordData);
    })
    .catch(next);
});
