import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import userWords from './userWords';
import userLevel from './userLevel';

const reducer = combineReducers({ user, userWords, userLevel });
const middleware = [thunkMiddleware, createLogger({ collapsed: true })];

// SETUP w/ REDUX DevTools

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));

// SETUP w/o REDUX DevTools
// const store = createStore(reducer, applyMiddleware(...middleware));

export default store;
export * from './user';
export * from './userWords';
export * from './userLevel';
