/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './main';
export { default as Landing } from './landing';
export { default as Splash } from './Splash';
export { default as DataVisPanel } from './DataVisPanel';
export { default as UserHome } from './user-home';
export { default as Record } from './Record';
export { default as Navbar } from './Navbar';
export { default as Games } from './Games';
export { default as SynonymGame } from './SynonymGame';
export { default as Definitions } from './games/Definitions';
export { Login, Signup } from './auth-form';
