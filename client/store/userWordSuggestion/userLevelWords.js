import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_REC_WORDS_FOR_LEVEL = 'GET_REC_WORDS_FOR_LEVEL';


/**
 * INITIAL STATE
 */
const userWords = {};

/**
 * ACTION CREATORS
 */
export const getLevelWords = userWords => ({ type: GET_REC_WORDS_FOR_LEVEL, userWords });


/**
 * THUNK CREATORS
 */
export const getRecWordsForLevel = (userId, level) => dispatch => {
  axios.get(`/api/users/${userId}/words/suggest/level/${level}`)
    .then(res => res.data)
    .then(suggestedWords => {
      dispatch(getLevelWords(suggestedWords));
    })
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (state = userWords, action) {
  switch (action.type) {
    case GET_REC_WORDS_FOR_LEVEL:
      return action.userWords;
    default:
      return state;
  }
}
