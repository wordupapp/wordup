import axios from 'axios';
import _ from 'lodash';

/**
 * ACTION TYPES
 */
const GET_RELATED_WORDS = 'GET_RELATED_WORDS';
const GET_DEFINITIONS_FOR_LEVEL = 'GET_DEFINITIONS_FOR_LEVEL';

/**
 * INITIAL STATE
 */
const state = {
  relatedWords: {},
  definitions: [],
};

/**
 * ACTION CREATORS
 */
export const getRelatedWords = words => ({ type: GET_RELATED_WORDS, words });
export const getDefinitionsForLevel = definitions => ({ type: GET_DEFINITIONS_FOR_LEVEL, definitions });
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


export const fetchDefinitionsForLevelThunk = userLevel => dispatch => {
  axios.get(`/api/words/definitions/${userLevel}`)
    .then(res => res.data)
    .then(definitions => dispatch(getDefinitionsForLevel(definitions)))
    .catch(console.error);
};

/**
 * REDUCER
 */
export default function (prevState = state, action) {
  const nextState = _.cloneDeep(prevState);
  switch (action.type) {
    case GET_RELATED_WORDS:
      nextState.relatedWords = action.words;
      break;
    case GET_DEFINITIONS_FOR_LEVEL:
      nextState.definitions = action.definitions;
      break;
    default:
      return prevState;
  }
  return nextState;
}
