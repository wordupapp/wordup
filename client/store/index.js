import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import userWords from './userWords';

const reducer = combineReducers({ user, userWords });
const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }));
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './userWords';
