import axios from 'axios';
// import history from '../history';

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
export const getWords = (userId) => dispatch => {
  axios.get(`/api/users/${userId}/words`)
    .then(res => res.data)
    .then(userWords => {
      const finalWords = userWords.map(word => {
        return {
          name: word[0],
          level: word[1] ? word[1].low : null,
          numUsed: word[2] ? word[2].low : null,
        };
      });
      dispatch(getUserWords(finalWords));
    })
    .catch(console.error);
};

export const sendWords = (words, userId) => dispatch => {
  axios.post(`/api/users/${userId}/words`, words)
    .then(res => res.data)
    .then(userWords => {
      const finalWords = userWords.map(word => {
        return {
          name: word[0],
          level: word[1] ? word[1].low : null,
          numUsed: word[2] ? word[2].low : null,
        };
      });
      dispatch(addUserWords(finalWords));
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
