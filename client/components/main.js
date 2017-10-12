/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';
import {
  Navbar,
} from './';

const Main = (props) => {
  const { children, handleClick, isLoggedIn } = props;
  const styles = {
    body: {
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    },
    containerFull: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      marginTop: '6em',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  return (
    <div style={styles.body}>
      <Navbar />
      <div style={styles.containerFull}>
        {children}
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main));

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
