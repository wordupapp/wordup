const Promise = require('bluebird');
const chance = require('chance')(123);
const toonavatar = require('cartoon-avatar');

const { db, graphDb } = require('./server/db');
const middleWordData = require('./public/assets/middleSchool-output.json');
let highWordData = require('./public/assets/highSchool-output.json');
let collegeWordData = require('./public/assets/college-output.json');

const session = graphDb.session();

const { User } = require('./server/db/models/');

/* -----------  Set up User data for Postgres ----------- */

const numUsers = 5;
const userEmails = chance.unique(chance.email, numUsers);
const userPhones = chance.unique(chance.phone, numUsers);

const adminUser = () => {
  return User.create({
    email: 'admin@admin.admin',
    password: 'admin',
    name: 'Admin Admin',
    phone: '222-222-2222',
    gender: 'female',
    image: toonavatar.generate_avatar({ gender: 'female' }),
    level: 1,
  })
    .catch(console.error);
}

const randomUser = () => {
  const gender = chance.gender().toLocaleLowerCase();
  const level = Math.ceil(Math.random() * 5);

  return User.create({
    email: userEmails.pop(),
    password: chance.string(),
    name: chance.name({ gender }),
    phone: userPhones.pop(),
    gender,
    image: toonavatar.generate_avatar({ gender }),
    level,
  })
    .catch(console.error);
};

const createUsers = () => {
  const promiseArr = [adminUser()];
  for (let i = 0; i < numUsers; i += 1) {
    promiseArr.push(randomUser());
  }
  return Promise.all(promiseArr);
};

const seedDb = () => (
  createUsers()
);

/* -----------  Set up Word data for Neo4j ----------- */

highWordData = highWordData.filter(highWord => {

  // check for duplicates in middle school words
  for (let i = 0; i < middleWordData.length; i += 1) {
    if (middleWordData[i].name === highWord.name) return false;
  }

  return true;
});


collegeWordData = collegeWordData.filter(collegeWord => {

  // check for duplicates in middle school words
  for (let i = 0; i < middleWordData.length; i += 1) {
    if (middleWordData[i].name === collegeWord.name) return false;
  }

  // check for duplicates in high school words
  for (let i = 0; i < highWordData.length; i += 1) {
    if (highWordData[i].name === collegeWord.name) return false;
  }

  return true;
});


const numWords = middleWordData.length + highWordData.length + collegeWordData.length;
let wordIdIndex = 0;
let definitionIndex = 0;
let exampleIndex = 0;
let relationIndex =0;

const createWords = (wordData, level) => {
  let cyperCode = '';
  wordData.forEach(datum => {
    const { name, definitions, examples, relations } = datum;
    wordIdIndex += 1;

    // Create node for word
    cyperCode += `CREATE (word${wordIdIndex}:Word {
      name:'${name}',
      level: ${level}
    })`;

    // Create relationships to definitions
    Object.keys(definitions).forEach(pos => {
      const defText = definitions[pos];
      if (defText.length > 0) {
        definitionIndex += 1;
        cyperCode += `CREATE (def${definitionIndex}:Definition {
            text: "${defText}"
          }),
          (word${wordIdIndex})
          -[:DEFINITON {partOfSpeech: "${pos}"}]
          ->(def${definitionIndex})`;
      }
    });

    // Create relationships to examples
    examples.forEach(example => {
      if (example.length > 0) {
        exampleIndex += 1;
        cyperCode += `CREATE (example${exampleIndex}:Example {
            text: "${exampleIndex}"
          }),
          (word${wordIdIndex})
          -[:Example]
          ->(example${exampleIndex})`;
      }
    });

    // Create relationships to related words
    Object.keys(relations).forEach(relation => {
      const relationText = relations[relation];
      if (relationText.length > 0) {
        relationIndex += 1;
        cyperCode += `CREATE (relation${relationIndex}:RelatedWords {
            text: "${relationText}"
          }),
          (word${wordIdIndex})
          -[:RELATEDTO {relation: "${relation}"}]
          ->(relation${relationIndex})`;
      }
    });
  });

  return cyperCode;
};


/* -----------  Set up User data for Neo4j ----------- */

const createGraphUsers = pgUsers => {
  let cypherCode = '';
  pgUsers.forEach(pgUser => {
    const { id, name, email, phone, gender, image, level } = pgUser;
    cypherCode += `CREATE (user${id}:User {
      pgId:${id},
      name:'${name}',
      email:'${email}',
      phone:'${phone}',
      gender:'${gender}',
      image:'${image}',
      level:${level}
    })`;
    const numWordsUsed = chance.integer({ min: 10, max: 30 });
    for (let i = 0; i < numWordsUsed; i += 1) {
      const timesUsed = chance.integer({ min: 1, max: 10 });
      const randWordId = chance.integer({ min: 1, max: numWords });
      cypherCode += `,(user${id})-[:USED {times: ${timesUsed}}]
        ->(word${randWordId})`;
    }
  });

  return cypherCode;
};

const seedGrapDb = pgUsers => {
  // let cyperCode = 'MATCH (n) DETACH DELETE n';
  let cyperCode = '';
  cyperCode += createWords(middleWordData, 7); // give level 7 for all middle school words
  cyperCode += createWords(highWordData, 8); // give level 8 for all middle school words
  cyperCode += createWords(collegeWordData, 9); // give level 9 for all middle school words
  cyperCode += createGraphUsers(pgUsers);

  return session.run(cyperCode);
};

/* -----------  Sync databases ----------- */

console.log('Syncing Postgres database wordup ...');

db.sync({ force: true })
  .then(() => {
    console.log('Seeding Postgres database wordup ...');
    return seedDb();
  })
  .then(pgUsers => {
    console.log('Seeding Neo4j database wordup ...');
    return seedGrapDb(pgUsers);
  })
  .then(() => {
    console.log('Seeding successful!');
  })
  .catch(console.error)
  .then(() => {
    db.close();
    session.close();
    return null;
  });
