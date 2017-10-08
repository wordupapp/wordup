import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Dropdown, Image } from 'semantic-ui-react';
import { logout } from '../store';

/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.links = [
      { url: '/record', name: 'Speak' },
      { url: '/data/1', name: 'Cloud' },
      { url: '/games', name: 'Play' },
    ];
    this.styles = {
      navbar: {
        height: `90px`,
        background: '#B413EC',
      },
      title: {
        fontSize: '40px',
        fontWeight: 800,
        color: '#ffffff',
      },
      menuItem: {
        color: '#ffffff',
        fontWeight: 'bold',
      },
      menuMenu: {
        fontSize: '20px',
        color: '#ffffff',
      },
      rightMenu: {
        fontSize: '20px',
        marginRight: 30,
        color: '#ffffff',
        fontWeight: 'bold',
      },
    };
  }

  render() {
    const { isLoggedIn, handleLogout, location, user } = this.props;

    const loggedInMenuOptions = this.links.map((link) => {
      return (
        <Menu.Item
          active={location.pathname === link.url}
          key={link.name}
          name={link.name}
          as={Link}
          to={link.url}
          style={this.styles.menuItem}>
          {link.name}
        </Menu.Item>
      );
    });

    const firstName = user.name ? user.name.split(' ')[0] : '';
    const userImage = user.image ? user.image : 'http://www.answerspoint.com/user/uploads/users/default_user.png';
    const dropTrigger = (
      <span>
        <Image avatar src={userImage} /> {firstName}
      </span>
    )

    return (
      <Menu floated fixed="top" secondary style={this.styles.navbar}>
        <Menu.Menu style={this.styles.menuMenu} >
          <Menu.Item
            header
            as={Link}
            to={'/'}>
            <span style={this.styles.title}>WORDUP</span>
          </Menu.Item>
          {isLoggedIn ?
            loggedInMenuOptions :
            null
          }
        </Menu.Menu>
        {isLoggedIn ? (
          <Menu.Menu position="right" style={this.styles.rightMenu}>
            <Dropdown trigger={dropTrigger} item style={this.styles.menuItem}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={'/home'}>
                  <Icon name='user' />
                  Your profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={'/home'}>
                  <Icon name='setting' />
                  Settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={'/home'}>
                  <Icon name='help circle' />
                  Help
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <Icon name='log out' />
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
