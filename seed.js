const Promise = require('bluebird');
const chance = require('chance')(123);
const toonavatar = require('cartoon-avatar');

const { db } = require('./server/db'); // postgres db for users (auth)
// const graphDb = require('./server/graphDb'); // graph db for all other data

const { User } = require('./server/db/models/');

/* -----------  Set up User data ----------- */

const numUsers = 5;
const userEmails = chance.unique(chance.email, numUsers);
const userPhones = chance.unique(chance.phone, numUsers);

const adminUser = () => {
  return User.create({
    email: 'admin@admin.admin',
    password: 'admin',
    phone: '222-222-2222',
    gender: 'female',
    image: toonavatar.generate_avatar({ gender: 'female' }),
    level: 1,
  })
    .catch(err => console.error(err));
}

const randomUser = () => {
  const gender = chance.gender().toLocaleLowerCase();
  const level = Math.ceil(Math.random() * 5);

  return User.create({
    email: userEmails.pop(),
    password: chance.string(),
    phone: userPhones.pop(),
    gender,
    image: toonavatar.generate_avatar({ gender }),
    level,
  })
    .catch(err => console.error(err));
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

// const seedGrapDb = () => (

// );


console.log('Syncing database wordup ...');

db.sync({ force: true })
  .then(() => {
    console.log('Seeding database wordup ...');
    return seedDb();
  })
  .then((users) => {
    console.log('users!!!!!!!', users)
    // return seedGrapDb(users);
  })
  .then(() => {
    console.log('Seeding successful!');
  })
  .catch(console.error)
  .then(() => {
    db.close();
    return null;
  });
