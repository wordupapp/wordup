import axios from 'axios';
// import history from '../history';

/**
 * ACTION TYPES
 */
const GET_RELATED_WORDS = 'GET_RELATED_WORDS';

/**
 * INITIAL STATE
 */
const relatedWords = {};

/**
 * ACTION CREATORS
 */
export const getRelatedWords = words => ({ type: GET_RELATED_WORDS, words });
/**
 * THUNK CREATORS
 */
export const getNewRelatedWords = userLevel => dispatch => {
  axios.get('/api/words', userLevel)
    .then(res => res.data)
    .then(userWords => {
      const finalWords = {};
      userWords.forEach(word => {
        finalWords[word[0]] = {
          level: word[1] ? word[1].low : null,
          numUsed: word[2] ? word[2].low : null,
        };
      });
      dispatch(getRelatedWords(finalWords));
    })
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (state = relatedWords, action) {
  switch (action.type) {
    case GET_RELATED_WORDS:
      return action.words;
    default:
      return state;
  }
}
