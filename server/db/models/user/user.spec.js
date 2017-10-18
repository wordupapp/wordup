/* global describe beforeEach it */

const { expect } = require('chai');
const { db } = require('../../index');

const User = db.model('user');
// const User = require('./index');

describe.only('User model', () => {
  beforeEach(() => db.sync({ force: true }));

  describe('model definition', () => {
    let testUser;

    beforeEach(() => (
      User.create({
        email: 'test@test.test',
        password: 'test',
        name: 'Test First',
        phone: '222-222-2222',
        gender: 'female',
        image: 'http://www.answerspoint.com/user/uploads/users/default_user.png',
      })
        .then(user => {
          testUser = user;
        })
    ));

    it('includes a correct email', () => {
      expect(testUser.email).to.be.equal('test@test.test');
    });

    it('requires an email', () => {
      testUser.email = null;

      return testUser.validate()
        .then(() => {
          throw new Error('validation should fail when email is empty');
        },
        result => {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain('notNull Violation');
        });
    });

    it('includes a correct name', () => {
      expect(testUser.email).to.be.equal('Test First');
    });

    it('includes a correct phone', () => {
      expect(testUser.email).to.be.equal('222-222-2222');
    });

    it('includes a correct gender', () => {
      expect(testUser.email).to.be.equal('female');
    });

    it('cannot set invalid gender', () => {
      testUser.gender = 'fake gender';

      return testUser.save()
        .then(() => {
          throw new Error('validation should fail when invalid gender for user is set');
        },
        result => {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain('invalid input value for enum');
        });
    });

    it('includes a correct image', () => {
      expect(testUser.image).to.be.equal('http://www.answerspoint.com/user/uploads/users/default_user.png');
    });
  });

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let testUser;

      beforeEach(() => {
        return User.create({
          email: 'test@test.test',
          password: 'tests',
        })
          .then(user => {
            testUser = user;
          });
      });

      it('returns true if the password is correct', () => {
        expect(testUser.correctPassword('tests')).to.be.equal(true);
      });

      it('returns false if the password is incorrect', () => {
        expect(testUser.correctPassword('testz')).to.be.equal(false);
      });
    });
  });
});
