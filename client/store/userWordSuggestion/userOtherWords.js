import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_REC_WORDS_FOR_OTHER = 'GET_REC_WORDS_FOR_OTHER';

/**
 * INITIAL STATE
 */
const userWords = {};

/**
 * ACTION CREATORS
 */
export const getOtherWords = userWords => ({ type: GET_REC_WORDS_FOR_OTHER, userWords });

/**
 * THUNK CREATORS
 */
export const getRecWordsForOther = (userId, level) => dispatch => {
  axios.get(`/api/users/${userId}/words/suggest/other/${level}`)
    .then(res => res.data)
    .then(suggestedWords => {
      dispatch(getOtherWords(suggestedWords));
    })
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (state = userWords, action) {
  switch (action.type) {
    case GET_REC_WORDS_FOR_OTHER:
      return action.userWords;
    default:
      return state;
  }
}
