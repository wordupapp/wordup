/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './main';
export { default as Landing } from './Landing';
export { default as UserHome } from './user-home';
export { default as Record } from './Record';
export { default as Navbar } from './Navbar';
export { default as Definitions } from './matching-game/Definitions';

export { Login, Signup } from './auth-form';
