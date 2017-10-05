import axios from 'axios';
import _ from 'lodash';

/**
 * ACTION TYPES
 */
const GET_RELATED_WORDS = 'GET_RELATED_WORDS';
const REMOVE_RELATED_WORD = 'REMOVE_RELATED_WORD';
const GET_DEFINITIONS_FOR_LEVEL = 'GET_DEFINITIONS_FOR_LEVEL';

/**
 * INITIAL STATE
 */
const state = {
  relatedWords: {},
  definitions: {},
};

/**
 * ACTION CREATORS
 */
export const getRelatedWords = (randomWord, relatedWords) => ({
  type: GET_RELATED_WORDS,
  randomWord,
  relatedWords,
});

export const removeRelatedWord = (currentWord, wordToRemove) => ({
  type: REMOVE_RELATED_WORD,
  currentWord,
  wordToRemove,
});

export const getDefinitionsForLevel = definitions => ({ type: GET_DEFINITIONS_FOR_LEVEL, definitions });
/**
 * THUNK CREATORS
 */
export const fetchRandWordAndRelatedWords = userLevel => dispatch => {
  axios.get(`/api/words/related/${userLevel}`)
    .then(res => res.data)
    .then(relatedWordInfo => {
      const randomWord = relatedWordInfo.randomWord;
      const relatedWords = relatedWordInfo.finalWords
        .map(wordGroup => wordGroup[0])
        .map(wordString => wordString.split(', '))
        .reduce((a, b) => a.concat(b), []);
      dispatch(getRelatedWords(randomWord, relatedWords));
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
      nextState.relatedWords[action.randomWord] = action.relatedWords;
      break;
    case REMOVE_RELATED_WORD:
      nextState.relatedWords[action.currentWord] = nextState.relatedWords[action.currentWord].filter(word => word !== action.wordToRemove);
      break;
    case GET_DEFINITIONS_FOR_LEVEL:
      nextState.definitions = action.definitions;
      break;
    default:
      return prevState;
  }
  return nextState;
}
