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
let wordIndex = 0;
let definitionIndex = 0;
let exampleIndex = 0;
let relationIndex = 0;

const createWords = (wordData, level) => {
  let cyperCode = '';
  wordData.forEach(datum => {
    const { name, definitions, examples, relations } = datum;
    wordIndex += 1;

    // Create node for word
    cyperCode += `
      CREATE (word${wordIndex}:Word {
        intId: ${wordIndex},
        name:'${name}',
        level: ${level}
      })`;

    // Create relationships to definitions
    Object.keys(definitions).forEach(pos => {
      const defText = definitions[pos];
      if (defText.length > 0) {
        definitionIndex += 1;
        cyperCode += `
          CREATE (def${definitionIndex}:Definition {
            text: "${defText}"
          }),
          (word${wordIndex})
          -[:DEFINITON {partOfSpeech: "${pos}"}]
          ->(def${definitionIndex})`;
      }
    });

    // Create relationships to examples
    examples.forEach(example => {
      if (example.length > 0) {
        exampleIndex += 1;
        cyperCode += `
          CREATE (example${exampleIndex}:Example {
            text: "${example}"
          }),
          (word${wordIndex})
          -[:Example]
          ->(example${exampleIndex})`;
      }
    });

    // Create relationships to related words
    Object.keys(relations).forEach(relation => {
      const relationText = relations[relation];
      if (relationText.length > 0) {
        relationIndex += 1;
        cyperCode += `
          CREATE (relation${relationIndex}:RelatedWords {
              text: "${relationText}"
          }),
          (word${wordIndex})
          -[:RELATEDTO {relation: "${relation}"}]
          ->(relation${relationIndex})`;
      }
    });
  });

  return cyperCode;
};


/* -----------  Set up User data for Neo4j ----------- */
let userWordIndex = 0;

const createGraphUsers = pgUsers => {

  const createUserPromiseArr = pgUsers.map(pgUser => {
    const { id, name, email, phone, gender, image, level } = pgUser;

    let cypherCode = `
    CREATE (user${id}:User {
      pgId:${id},
      name:'${name}',
      email:'${email}',
      phone:'${phone}',
      gender:'${gender}',
      image:'${image}',
      level:${level}
    })`;
    const numWordsUsed = chance.integer({ min: 10, max: 30 });
    const randWordIds = chance.unique(chance.integer, numWordsUsed, { min: 1, max: numWords });

    for (let i = 0; i < numWordsUsed; i += 1) {
      const timesUsed = chance.integer({ min: 1, max: 10 });
      const randWordId = randWordIds.pop();
      userWordIndex += 1;

      cypherCode += `
        WITH user${id}
        MATCH (word${userWordIndex}:Word)
          WHERE word${userWordIndex}.intId = ${randWordId}
        CREATE (user${id})
        -[:USED {times: ${timesUsed}}]
        ->(word${userWordIndex})`;
    }

    return () => session.run(cypherCode);
  });

  return createUserPromiseArr;
};

const seedGrapDb = pgUsers => {

  const cyperForMiddle = createWords(middleWordData, 7); // give level 7 for all middle school words
  const cyperForHigh = createWords(highWordData, 8); // give level 8 for all middle school words
  const cyperForCollege = createWords(collegeWordData, 9); // give level 9 for all middle school words

  return session.run(cyperForMiddle)
    .then(() => {
      console.log('Seeded words for middle school!');
      return session.run(cyperForHigh);
    })
    .then(() => {
      console.log('Seeded words for high school!');
      session.run(cyperForCollege);
    })
    .then(() => {
      console.log('Seeded words for college!');
      return new Promise(async (resolve, reject) => {
        const createUserThunks = createGraphUsers(pgUsers);
        for (let i = 0; i < createUserThunks.length; i++) {
          await createUserThunks[i]();
        }
        resolve(true);
      })
    });
};

/* -----------  Sync databases ----------- */

console.log('Syncing Postgres database wordup ...');

// REVIEW: don't change this right now, but this is a good place to practice
//          using async/await
/* THIS:
async function runSeed () {
  try {
    const pgUsers = await seedDb();
    await seedGrapDb(pgUsers);
    console.log('Seeded users with random relationships to words!');
    console.log('Seeding successful!');
    await db.close();
    await session.close();
  }
  catch (error) {
    console.error(error);
  }
}

runSeed();

VS THIS:
*/
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
    console.log('Seeded users with random relationships to words!');
    console.log('Seeding successful!');
  })
  .catch(console.error)
  .then(() => {
    db.close();
    session.close();
    return null;
  });
