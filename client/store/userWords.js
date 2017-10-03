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
// REVIEW: more async/await opportunity
export const getWords = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/${userId}/words`);
    const userWords = res.data;
    const finalWords = userWords.map(word => {
      return {
        name: word[0],
        level: word[1] ? word[1].low : null,
        numUsed: word[2] ? word[2].low : null,
      };
    });
    dispatch(getUserWords(finalWords));
  }
  catch (error) {
    console.error(error);
  }
};

export const sendWords = (words, userId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/users/${userId}/words`, words);
    const userWords = res.data;
    const finalWords = userWords.map(word => {
      return {
        name: word[0],
        level: word[1] ? word[1].low : null,
        numUsed: word[2] ? word[2].low : null,
      };
    });
    dispatch(addUserWords(finalWords));
  }
  catch (error) {
    console.error(error);
  }
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
