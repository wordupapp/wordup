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
export const getWords = () => dispatch => {
  axios.get('users/id/words')
    .then(res => res.data)
    .then(userWords => dispatch(getUserWords(userWords)))
    .catch(console.error);
};

export const sendWords = words => dispatch => {
  axios.post('users/id/words', words)
    .then(res => res.data)
    .then(newWords => dispatch(addUserWords(newWords)))
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
      return Object.assign({}, state, action.userWords);
    default:
      return state;
  }
}
