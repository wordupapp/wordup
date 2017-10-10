import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import Splash from './Splash';
import {
  Login,
  Signup,
} from './auth-form';

const containerStyles = {
  width: "900px",
  display: "flex",
  alignItems: "left",
  justifyContent: "center",
  flexWrap: "wrap",
  flexDirection: "column",
  marginTop: "auto",
  padding: "0px 0px 300px 100px",
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
  button: {
    marginTop: 25,
  },
};

const Welcome = props => (
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

const Landing = props => {
  let component = "";
  switch (props.match.path) {
    case "/login":
      component = <Login />;
      break;
    case "/signup":
      component = <Signup />;
      break;
    default: component = <Welcome />;
  }
  return (
    <Splash>
      {component}
    </Splash>
  );
};


// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(Landing);
