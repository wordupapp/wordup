/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const { db } = require('../../db');
const app = require('../../index');

const User = db.model('user');

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe('/api/users/', () => {
    const testEmail = 'test@test.test';
    const testName = 'Test First';
    const testPhone = '222-222-2222';
    const testGender = 'female';
    const testImage = 'http://www.answerspoint.com/user/uploads/users/default_user.png';

    beforeEach(() => {
      return User.create({
        email: testEmail,
        name: testName,
        phone: testPhone,
        gender: testGender,
        image: testImage,
      });
    });

    it('GET /api/users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].email).to.be.equal(testEmail);
          expect(res.body[0].name).to.be.equal(testName);
          expect(res.body[0].phone).to.be.equal(testPhone);
          expect(res.body[0].gender).to.be.equal(testGender);
          expect(res.body[0].image).to.be.equal(testImage);
        });
    });

    it('GET /api/users/:id', () => {
      return request(app)
        .get('/api/users/1')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.email).to.be.equal(testEmail);
          expect(res.body.name).to.be.equal(testName);
          expect(res.body.phone).to.be.equal(testPhone);
          expect(res.body.gender).to.be.equal(testGender);
          expect(res.body.image).to.be.equal(testImage);
        });
    });
  });
});
