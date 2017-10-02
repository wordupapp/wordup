import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { logout } from '../store';

/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.links = [
      { url: '/data', name: 'Data' },
      { url: '/games', name: 'Games' },
      { url: '/profile', name: 'Profile' },
    ];
    this.styles = {
      navbar: {
        minHeight: `3.5em`,
        height: `3.8em`,
        background: '#0a00b6',
      },
      title: {
        fontSize: '1.2em',
        background: '#6200ea',
      },
      rightMenu: {
        width: '145px',
        minHeight: `3.5em`,
        height: `3.8em`,
        margin: 0,
        top: 'auto',
        right: 10,
        left: 'auto',
        position: 'fixed',
      },
    };
  }

  render() {
    const { isLoggedIn, handleLogout } = this.props;

    return (
      <Menu inverted floated fixed="top" stackable style={this.styles.navbar}>
        <Menu.Menu>
          <Menu.Item
            active={this.props.location.pathname === '/'}
            as={Link}
            to={'/'}
            style={this.styles.title}>
            wordUp
          </Menu.Item>
        </Menu.Menu>
        {this.links.map((link) => {
          return (
            <Menu.Item
              active={this.props.location.pathname === link.url}
              key={link.name}
              name={link.name}
              as={Link}
              to={link.url}>
              {link.name}
            </Menu.Item>
          );
        })}
        {isLoggedIn ? (
          <Menu.Menu style={this.styles.rightMenu}>
            <Menu.Item name={`Logout`} onClick={handleLogout} />
            <Menu.Item active={this.props.location.pathname === '/'} as={Link} to={'/'}>
              <Icon name="user" size="big" />
            </Menu.Item>
          </Menu.Menu>
        ) : (
          <Menu.Menu style={this.styles.rightMenu}>
            <Menu.Item name="Login" as={Link} to={`/login`} />
          </Menu.Menu>
        )}
      </Menu>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user,
  };
};

const mapDispatch = (dispatch) => ({
  handleLogout: (evt) => {
    evt.preventDefault();
    dispatch(logout());
  },
});

export default withRouter(connect(mapState, mapDispatch)(Navbar));

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
