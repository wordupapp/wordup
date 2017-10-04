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
        marginRight: 30,
      },
    };
  }

  render() {
    const { isLoggedIn, handleLogout } = this.props;
    const loggedInMenuOptions = this.links.map((link) => {
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
    });
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
        {isLoggedIn ? (
          <Menu.Menu position="right" style={this.styles.rightMenu}>
            {loggedInMenuOptions}
            <Menu.Item active={this.props.location.pathname === '/home'} as={Link} to={'/home'}>
              <Icon name="user" size="big" />
            </Menu.Item>
            <Menu.Item name={`Logout`} onClick={handleLogout} />
          </Menu.Menu>
        ) : (
          <Menu.Item name="Login" as={Link} to={`/login`} position="right" style={this.styles.rightMenu} />
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
