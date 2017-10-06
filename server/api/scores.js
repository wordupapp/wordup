const router = require('express').Router();
const { User, Score } = require('../db/models');
const Promise = require('bluebird');

module.exports = router;

// GET for all spcres for a user
router.get('/:userId', (req, res, next) => {

  // if (!req.user) {
  //   res.status(401).send('You must be logged in to get your score.');
  // }

  Score.findAll({
    where: {
      userId: req.params.userId,
    },
  })
    .then(scores => res.json(scores))
    .catch(next);
});

// POST for new score for a user
router.post('/:userId', (req, res, next) => {

  // if (!req.user) {
  //   res.status(401).send('You must be logged in to add a score.');
  // }

  User.findById(req.params.userId)
    .then(user => {
      const scorePromise = Score.create({
        score: req.body.score,
      });
      return Promise.all([user, scorePromise]);
    })
    .spread((user, score) => user.addScore(score))
    .then(() => res.sendStatus(200))
    .catch(next);
});
