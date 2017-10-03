const fs = require('fs');
const unirest = require('unirest');
const promiseRetry = require('promise-retry');

// Change below to use different data file!!
const wordData = require('./public/assets/college-words.json');

/* ----------- API calls to Twinword to get word details ----------- */

const getDefinition = (wordName) => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/definition/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200 ) resolve(result.body.meaning);
        else reject(`Failed to get definitions for: ${wordName}`);
      });
  })
}

const getExample = (wordName) => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/example/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200 ) resolve(result.body.example);
        else reject(`Failed to get examples for: ${wordName}`);
      });
  })
}

const getRelation = (wordName) => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://twinword-word-graph-dictionary.p.mashape.com/reference/?entry=${wordName}`)
      .header("X-Mashape-Key", "5F9jWJK7bDmshtKmwVHBO61VICEFp1qAo5EjsnPJeSefmtA065")
      .header("Accept", "application/json")
      .end(result => {
        if (result.status === 200 ) resolve(result.body.relation);
        else reject(`Failed to get relations for: ${wordName}`);
      });
  })
}

const retryCallsToApi = (getDetail, wordName) => {
  return promiseRetry(function (retry, number) {
      console.log('Attempt number:', number);

      return getDetail(wordName)
        .catch(retry);
  })
}

/* ----------- Use APIs to convert word data to data with word detail ----------- */

const wordsWithDetail = [];

const getWordDetailFromApi = async (wordData) => {

  const wordName = wordData.name;
  const newWordData = Object.assign({}, wordData);

  // const meaning = await getDefinition(wordName);
  // const examples = await getExample(wordName);
  // const relations = await getRelation(wordName);
  const meaning = await retryCallsToApi(getDefinition, wordName);
  const examples = await retryCallsToApi(getExample, wordName);
  const relations = await retryCallsToApi(getRelation, wordName);
  newWordData.definitions = meaning;
  newWordData.examples = examples;
  newWordData.relations = relations;

  wordsWithDetail.push(newWordData);
}

const wordPromiseArr = wordData.map(wordDatum => {
  return getWordDetailFromApi(wordDatum);
});


/* ----------- Create output file for seeding ----------- */

Promise.all(wordPromiseArr)
  .then(() => {
    // Change below to use different output file!!
    fs.writeFile("./public/assets/college-output.json",
      JSON.stringify(wordsWithDetail, null, 2),
      'utf-8',
      err => {
        if (err) {
          return console.error(err);
        }
        console.log("Output file was saved!");
      }
    );
  })
  .catch(console.error);
