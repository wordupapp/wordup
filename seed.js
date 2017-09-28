const Promise = require('bluebird');
const chance = require('chance')(123);
const toonavatar = require('cartoon-avatar');

const { db, graphDb } = require('./server/db');

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
  });

  return session.run(cypherCode);
};

const seedGrapDb = pgUsers => {
  const cyperCode = 'MATCH (n) DETACH DELETE n';
  return session.run(cyperCode)
    .then(() => createGraphUsers(pgUsers));
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
