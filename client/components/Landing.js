import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import Splash from './Splash';
import {
  Login,
  Signup,
} from './auth-form';

const containerStyles = {
  width: "50%",
  display: "flex",
  alignItems: "left",
  flexWrap: "wrap",
  flexDirection: "column",
  marginLeft: "5rem",
  marginTop: "15rem",
};

const subContainerStyles = {
  display: "flex",
  marginTop: "2rem",
};

const headerStyles = {
  h1: {
    color: '#2b282e',
    fontSize: 36,
  },
  h3: {
    color: '#2b282e',
    fontSize: 28,
  },
  h4: {
    color: '#2b282e',
    fontSize: 20,
    margin: "auto 2rem",
  },
  button: {
    marginTop: 25,
  },
};

const iconStyles = {
  color: '#2b282e',
};

const Visitor = () => (
  <div style={containerStyles}>
    <h1 style={headerStyles.h1}>
      Want to up your vocabulary game?
    </h1>
    <h3 style={headerStyles.h3}>
      Analyze your vocabulary level, get custom recommendations and play some games to learn new words.
    </h3>
    <Link to="/signup">
      <Button
        inverted
        size="massive"
        style={headerStyles.button}>
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
  <div style={containerStyles}>
    <h1 style={headerStyles.h1}>
      What would you like to do today?
    </h1>
    {
      options.map(option => {
        return (
          <Link to={`/${option.ref}`} key={option.key} style={subContainerStyles}>
            <Icon size="huge" name={option.icon} style={iconStyles} />
            <h4 style={headerStyles.h4}>
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
    <Splash>
      {component}
    </Splash>
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

