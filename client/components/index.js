// REVIEW: watch for consistent naming patterns in component file names
// auth-form, Navbar, main, Splash
// PICK A CONVENTION AND STICK TO IT:
/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './main';
export { default as Landing } from './Landing';
export { default as UserHome } from './user-home';
export { default as Record } from './Record.jsx';
export { default as Navbar } from './Navbar';
export { Login, Signup } from './auth-form';
