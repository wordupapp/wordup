import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const Splash = props => {
  const { children } = props;

  const background = 'landing.jpg';
  const styles = {
    splash: {
      display: 'flex',
      position: 'absolute',
      // justifyContent: 'center',
      // alignItems: 'center',
      top: 0,
      bottom: 0,
      background: `url(${background}) no-repeat center center fixed`,
      backgroundSize: 'cover',
      marginTop: 0,
      boxShadow: '0 0 0 1000px rgba(0,0,0,0.25) inset',
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