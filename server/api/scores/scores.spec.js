/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const { db } = require('../../db');
const app = require('../../index');

const User = db.model('user');
const Score = db.model('score');

describe('Score routes', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe('/api/users/', () => {
    const testEmail = 'test@test.test';
    const testScore = 100;

    beforeEach(() => {
      return User.create({
        email: testEmail,
      })
        .then(user => {
          const scorePromise = Score.create({
            score: testScore,
          });
          return Promise.all([user, scorePromise]);
        })
        .then(([user, score]) => user.addScore(score));
    });

    it('GET /api/scores/:userId', () => {
      return request(app)
        .get('/api/scores/1')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0].score).to.be.equal(testScore);
        });
    });

    it('POST /api/scores/:userId', () => {
      return request(app)
        .post('/api/scores/1')
        .expect(200);
    });
  });
});
