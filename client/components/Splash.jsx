import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const Splash = props => {
  const { children } = props;

  const background = 'yellowLanding.jpg';
  const styles = {
    splash: {
      display: 'flex',
      position: 'absolute',
      top: 0,
      bottom: 0,
      background: `url(${background}) no-repeat`,
      backgroundSize: "cover",
      marginTop: "6rem",
    },
  };

  return (
    <Container style={styles.splash} fluid>
      {children}
    </Container>
  );
};

export default Splash;

/**
 * PROP TYPES
 */
Splash.propTypes = {
  children: PropTypes.object,
};
