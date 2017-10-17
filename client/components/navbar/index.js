import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Dropdown, Image } from 'semantic-ui-react';
import { logout } from '../../store';
import styles from './styles';

/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.links = [
      { url: '/record', name: 'Speak' },
      { url: '/data/1', name: 'Stats' },
      { url: '/games', name: 'Play' },
    ];
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
      <Menu floated fixed="top" secondary style={styles.navbar}>
        <Menu.Menu style={styles.menuMenu} >
          <Link to="/">
            <img
              alt="wordUP"
              src="/logo.svg"
              height="75"
              style={styles.logo}
            />
          </Link>
          {isLoggedIn ?
            loggedInMenuOptions :
            null
          }
        </Menu.Menu>
        {isLoggedIn ? (
          <Menu.Menu position="right" style={styles.rightMenu}>
            <Dropdown trigger={dropTrigger} item style={styles.menuItem}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={'/home'}>
                  <Icon name='user' />
                  Your profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={'/newwords'}>
                  <Icon name='rocket' />
                  New words
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
          <Menu.Item name="Login" as={Link} to={`/login`} position="right" style={styles.rightMenu} />
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
