const router = require('express').Router();
const unirest = require('unirest');
const promiseRetry = require('promise-retry');
const neo4j = require('neo4j-driver').v1;
const Api = require('rosette-api');
const ArgumentParser = require('argparse').ArgumentParser;

const { User } = require('../../db/models');
const { graphDb } = require('../../db');
const stopWords = require('../../../public/assets/json/stopwords.json');

const session = graphDb.session();

module.exports = router;

router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'email', 'name', 'phone', 'gender', 'image'],
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
    RETURN words.name,words.level,r.times,r.dates
  `;
  session.run(cypherCode)
    .then(data => data.records)
    .then(words => {
      let wordData = words.map(word => word._fields);
      wordData.forEach(word => {
        word[3] = word[3].map(bitTime => {
          // conver 64 bit integer to integer
          return neo4j.int(bitTime).toNumber()
        })
      });
      res.json(wordData);
    })
    .catch(next);
});

/* -----------  Helper functions to get word details from graph DB ----------- */

const getWordDefinitions = wordArr => {

  if (!wordArr) return [null, null];

  const wordNameArr = wordArr.map(wordData => {
    return wordData._fields[0].properties.name;
  })
  const getDefPromiseArr = wordNameArr.map(wordName =>
    {
    const cypherCode = `
      MATCH (word:Word {name: "${wordName}"})
      MATCH (word)-[r:DEFINITION]
        ->(def:Definition)
      RETURN r.partOfSpeech, def.text
    `;
    return session.run(cypherCode)
  })
  return Promise.all([wordNameArr, Promise.all(getDefPromiseArr)]);
}

const getWordExamples = ([wordNameArr, wordDefDataArr]) => {

  if (!wordNameArr) return [null, null, null];

  const wordDefArr = wordDefDataArr.map(wordData => {
    return wordData.records.map(record => ({
      pos: record._fields[0],
      text: record._fields[1]
    }));
  })

  const getExamplePromiseArr = wordNameArr.map(wordName =>
    {
    const cypherCode = `
      MATCH (word:Word {name: "${wordName}"})
      MATCH (word)-[:EXAMPLE]
        ->(ex:Example)
      RETURN ex.text
    `;
    return session.run(cypherCode)
  })

  return Promise.all([wordNameArr, wordDefArr, Promise.all(getExamplePromiseArr)]);
}

const getWordRelations = ([wordNameArr, wordDefArr, wordExampleDataArr]) => {

  if (!wordNameArr) return [null, null, null, null];

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
}

const combineAllWordDetails = ([wordNameArr, wordDefArr, wordExampleArr, wordRelationDataArr]) => {

  if (!wordNameArr) return;

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
}

/* ------------------------------------------------------------------------------ */

router.get('/:id/words/suggest/level/:level', (req, res, next) => {
  const userId = req.params.id;
  const userLevel = +req.params.level;

  // TODO: this logic is subject to change as our db grows larger
  if (userLevel < 5) level = 5;
  else if (userLevel > 8) level =9;
  else level = userLevel+1;

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
        MATCH (word:Word)
          WHERE NOT ((user)-[:USED]-(word)) AND
            word.level >= ${level}
        RETURN word
        SKIP ${randomNumber}
        LIMIT 9
      `;
      return session.run(cypherCodeForWord);
    })
    .then(data => data ? data.records : null)
    .then(getWordDefinitions)
    .then(getWordExamples)
    .then(getWordRelations)
    .then(combineAllWordDetails)
    .then(data => res.json(data))
    .catch(next);

});

router.get('/:id/words/suggest/other/:level', (req, res, next) => {
  const userId = req.params.id;
  const userLevel = +req.params.level;

  // TODO: this logic is subject to change as our db grows larger
  if (userLevel < 5) level = 5;
  else if (userLevel > 8) level =9;
  else level = userLevel+1;

  const cypherCode = `
    MATCH (user:User {pgId: ${userId}})
      -[:USED]->
      (sharedWord:Word)
      <-[:USED]-
      (otherUser:User),
      (otherUser)-[:USED]->(otherWord:Word)
    WITH
      user, otherUser, otherWord,
      COUNT(sharedWord) AS sharedWordCount
    WHERE NOT (user)-[:USED]->(otherWord) AND
      otherWord.level >= ${level} AND
      sharedWordCount >= 3
    RETURN otherWord
  `;

  session.run(cypherCode)
    .then(data => data.records)
    .then(getWordDefinitions)
    .then(getWordExamples)
    .then(getWordRelations)
    .then(combineAllWordDetails)
    .then(data => res.json(data))
    .catch(next);

});

/* -----------  Helper functions to Twinword APIs get word details ----------- */

const getLevel = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-language-scoring.p.mashape.com/word/?entry=${wordName}`)
      .header("X-Mashape-Key", process.env.X_MASHAPE_KEY)
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) {
          console.log('Level API usage: ', result.headers);
          resolve(result.body.ten_degree);
        } else reject(`Failed to get level for: ${wordName}`);
      });
  });
};

const getDefinition = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/definition/?entry=${wordName}`)
      .header("X-Mashape-Key", process.env.X_MASHAPE_KEY)
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) {
          console.log('Definition API usage: ', result.headers);
          resolve(result.body.meaning);
        } else reject(`Failed to get definitions for: ${wordName}`);
      });
  });
};

const getExample = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/example/?entry=${wordName}`)
      .header("X-Mashape-Key", process.env.X_MASHAPE_KEY)
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) {
          console.log('Language scoring API usage: ', result.headers);
          resolve(result.body.example);
        } else reject(`Failed to get examples for: ${wordName}`);
      });
  });
};

const getRelation = wordName => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/reference/?entry=${wordName}`)
      .header("X-Mashape-Key", process.env.X_MASHAPE_KEY)
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200) {
          console.log('Language scoring API usage: ', result.headers);
          resolve(result.body.relation);
        } else reject(`Failed to get relations for: ${wordName}`);
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

  const { name, definitions, examples, relations } = wordData;
  let { level } = wordData;
  let definitionIndex = 0;
  let exampleIndex = 0;
  let relationIndex = 0;
  if (!level) level = 0;

  // Merge for User & Word
  let cypherCode = `
    MATCH (user:User {pgId: ${userId}})
    MERGE (word:Word {name: '${name}'})
      ON CREATE SET word.level = ${level}
      ON MATCH SET word.level = ${level}
    MERGE (user)-[r:USED]->(word)
      ON CREATE SET r.dates=[timestamp()], r.times = 1
      ON MATCH SET r.dates=r.dates + timestamp(), r.times = r.times + 1
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
    RETURN word.name,word.level,r.times,r.dates
    `;

  return cypherCode;
}

/* ------------------------------------------------------------------------------ */

/* -----------  Helper functions for Rosette's morphological analysis ----------- */

const rosetteAnalysis = async (speech) => {

  const parser = new ArgumentParser({
    addHelp: true,
    description: "Get the complete morphological analysis of a piece of text"
  });
  parser.addArgument(["--key"], {help: "Rosette API key", required: true});
  parser.addArgument(["--url"], {help: "Rosette API alt-url", required: false});
  const args = parser.parseArgs(['--key', process.env.ROSETTEAPI_KEY]);

  const api = new Api(args.key, args.url);
  const endpoint = "morphology";

  api.parameters.content = speech;
  api.parameters.language = "eng";
  api.parameters.morphology = "complete";

  return new Promise ((resolve, reject) => {
    api.rosette(endpoint, function(err, res){
      if(err){
          console.log(err);
          reject (`Rosette analysis failed for: ${speech}`);
      } else {
          // console.log(JSON.stringify(res, null, 2));
          const retWordArr = [];
          const excludePOS = ["NUM", "PRON", "PROPN", "PUNCT", "SYM", "X"];
          if (res) {
            const { posTags, lemmas } = res;
            for (let i = 0; i < posTags.length; i++){
              if (excludePOS.indexOf(posTags[i]) === -1) {
                retWordArr.push(lemmas[i])
              }
            }
          }
          resolve(retWordArr);
      }
    });
  })
}

/* ---------------------------------------------------------------------------------- */

router.post('/:id/words', async (req, res, next) => {
  const userId = req.params.id;
  const { speech } = req.body;

  const newWords = await rosetteAnalysis(speech);

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
