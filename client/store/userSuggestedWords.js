import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_USER_SUGGESTED_WORDS = 'GET_USER_SUGGESTED_WORDS';

/**
 * INITIAL STATE
 */
const userWords = {};

/**
 * ACTION CREATORS
 */
export const getUserSuggestedWords = userWords => ({ type: GET_USER_SUGGESTED_WORDS, userWords });

/**
 * THUNK CREATORS
 */
export const getSuggestedWords = (userId, level) => dispatch => {
  axios.get(`/api/users/${userId}/words/suggest/${level}`)
    .then(res => res.data)
    .then(suggestedWords => {
      dispatch(getUserSuggestedWords(suggestedWords));
    })
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (state = userWords, action) {
  switch (action.type) {
    case GET_USER_SUGGESTED_WORDS:
      return action.userWords;
    default:
      return state;
  }
}
