/* global describe beforeEach it */

const { expect } = require('chai');
const db = require('../../index');

const Score = db.model('score');

describe('Score model', () => {
  beforeEach(() => db.sync({ force: true }));

  let userScore;

  beforeEach(() => (
    Score.Create({
      score: 100,
    })
      .then(score => {
        userScore = score;
      })
  ));

  it('includes a score', () => {
    expect(userScore.score).to.be.equal(100);
  });

  it('has star value greater than equal to 0', () => {
    userScore.score = -50;

    return userScore.validate()
      .then(() => {
        throw new Error('validation should fail when score is negative');
      },
      result => {
        expect(result).to.be.an.instanceOf(Error);
        expect(result.message).to.contain('Validation min on scire failed');
      });
  });
});
