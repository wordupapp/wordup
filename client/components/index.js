/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './main';
export { default as Landing } from './welcome';
// export { default as Splash } from './Splash';
export { default as DataVisPanel } from './data';
export { default as DataVisWordCloud } from './data/DataVisWordCloud';
export { default as DataVisUsageTrends } from './data/DataVisUsageTrends';
export { default as UserHome } from './user-home';
export { default as Record } from './record';
export { default as Navbar } from './navbar';
export { default as Games } from './games';
export { default as SynonymGame } from './games/synonym-game';
export { default as Definitions } from './games/definitions-game';
export { Login, Signup } from './auth';
export { default as NewWordsPanel } from './new-words';
