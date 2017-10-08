import axios from 'axios';
import { setUserLevel } from './userLevel';
import { getSuggestedWords } from './userSuggestedWords';

/**
 * ACTION TYPES
 */
const GET_USER_WORDS = 'GET_USER_WORDS';
const ADD_USER_WORDS = 'ADD_USER_WORDS';

/**
 * INITIAL STATE
 */
const userWords = {};

/**
 * ACTION CREATORS
 */
export const getUserWords = userWords => ({ type: GET_USER_WORDS, userWords });
export const addUserWords = newWords => ({ type: ADD_USER_WORDS, newWords });
/**
 * THUNK CREATORS
 */

const calcUserLevel = wordsObj => {
  let levelSum = 0;
  let wordCount = 0;

  Object.keys(wordsObj).forEach(word => {
    const wordLevel = wordsObj[word].level;
    if (wordLevel > 0) {
      levelSum += wordLevel;
      wordCount += 1;
    }
  });

  return Math.floor(levelSum / wordCount);
};

export const getWords = userId => dispatch => {
  axios.get(`/api/users/${userId}/words`)
    .then(res => res.data)
    .then(userWords => {
      const finalWords = {};
      userWords.forEach(word => {
        finalWords[word[0]] = {
          level: word[1] ? word[1].low : null,
          numUsed: word[2] ? word[2].low : null,
          dates: word[3] ? word[3] : '',
        };
      });
      dispatch(getUserWords(finalWords));
      const level = calcUserLevel(finalWords);
      dispatch(setUserLevel(level));
      dispatch(getSuggestedWords(userId, level));
    })
    .catch(console.error);
};

export const sendWords = (words, userId) => dispatch => {
  axios.post(`/api/users/${userId}/words`, words)
    .then(res => res.data)
    .then(userWords => {
      const finalWords = {};
      userWords.forEach(word => {
        finalWords[word[0]] = {
          level: word[1] ? word[1].low : null,
          numUsed: word[2] ? word[2].low : null,
          dates: word[3] ? word[3] : '',
        };
      });
      dispatch(addUserWords(finalWords));
      dispatch(setUserLevel(calcUserLevel(finalWords)));
    })
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (state = userWords, action) {
  switch (action.type) {
    case GET_USER_WORDS:
      return action.userWords;
    case ADD_USER_WORDS:
      return Object.assign({}, state, action.newWords);
    default:
      return state;
  }
}
