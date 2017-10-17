import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Container, Icon } from 'semantic-ui-react';
import styles from './styles';

import {
  Login,
  Signup,
} from '../auth';

const Visitor = () => (
  <div style={styles.container}>
    <h1 style={styles.h1}>
      Want to up your vocabulary game?
    </h1>
    <h3 style={styles.h3}>
      Analyze your vocabulary level, get custom recommendations and play some games to learn new words.
    </h3>
    <Link to="/signup">
      <Button
        inverted
        size="massive"
        style={styles.button}>
      Get Started
      </Button>
    </Link>
  </div>
);

const options = [
  { key: 0, name: 'Games', ref: 'games', icon: 'trophy', text: 'Play some games to learn new words.' },
  { key: 1, name: 'Record', ref: 'record', icon: 'microphone', text: 'Record a sample audio to analyze your vocab level.' },
  { key: 2, name: 'Stats', ref: 'data/1', icon: 'line chart', text: 'Checkout some fun facts about the words you\'ve spoken!' },
];

const User = () => (
  <div style={styles.container}>
    <h1 style={styles.h1}>
      What would you like to do today?
    </h1>
    {
      options.map(option => {
        return (
          <Link to={`/${option.ref}`} key={option.key} style={styles.subContainer}>
            <Icon size="huge" name={option.icon} style={styles.icon} />
            <h4 style={styles.h4}>
              {option.text}
            </h4>
          </Link>
        )
      })
    }
  </div>
);

const Welcome = ({ user } = props) => {
  const authenticated = Object.keys(user).length;
  return authenticated ? <User /> : <Visitor />;
};

const Landing = props => {
  let component = "";
  switch (props.match.path) {
    case "/login":
      component = <Login />;
      break;
    case "/signup":
      component = <Signup />;
      break;
    default: component = <Welcome user={props.user} />;
  }
  return (
    <Container style={styles.splash} fluid>
      {component}
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
// export default withRouter(Landing);
export default withRouter(connect(mapStateToProps)(Landing));

