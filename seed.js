const Promise = require('bluebird');
const chance = require('chance')(123);
const toonavatar = require('cartoon-avatar');

const { db, graphDb } = require('./server/db');
const wordData = require('./public/assets/middleSchool-words.json');

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
const numWords = wordData.length; // 100 for now

const createWords = () => {
  let cyperCode = '';
  let id = 0;
  wordData.forEach(datum => {
    const { name } = datum;
    id += 1;
    cyperCode += `CREATE (word${id}:Word {
      intId:${id},
      name:'${name}'
    })`;
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
      cypherCode += `,(user${id})-[:USED {times: ${timesUsed}}]->(word${randWordId})`;
    }
  });

  return cypherCode;
};

const seedGrapDb = pgUsers => {
  // let cyperCode = 'MATCH (n) DETACH DELETE n ';
  let cyperCode = '';
  cyperCode += createWords();
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
