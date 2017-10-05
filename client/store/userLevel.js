/**
 * ACTION TYPES
 */
const GET_USER_LEVEL = 'GET_USER_LEVEL';
const SET_USER_LEVEL = 'SET_USER_LEVEL';

/**
 * INITIAL STATE
 */
const userLevel = 0;

/**
 * ACTION CREATORS
 */
export const getUserLevel = () => ({ type: GET_USER_LEVEL });
export const setUserLevel = level => ({ type: SET_USER_LEVEL, level });

/**
 * REDUCER
 */
export default function (state = userLevel, action) {
  switch (action.type) {
    case GET_USER_LEVEL:
      return state;
    case SET_USER_LEVEL:
      return action.level;
    default:
      return state;
  }
}
