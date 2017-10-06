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
      { url: '/record', name: 'Record' },
      { url: '/data/1', name: 'Data' },
      { url: '/games', name: 'Games' },
    ];
    this.styles = {
      navbar: {
        height: `90px`,
        background: '#6200ea',
      },
      title: {
        fontSize: '30px',
      },
      menuMenu: {
        fontSize: '20px',
        fontWeight: '500',
        color: '#ffffff',
        fontFamily: 'museo-sans-rounded,sans-serif!important',
      },
      rightMenu: {
        fontSize: '20px',
        fontWeight: '500',
        color: '#ffffff',
        marginRight: 30,
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
          to={link.url}>
          {link.name}
        </Menu.Item>
      );
    });

    // const dropOptions = [
    //   <Dropdown.item
    //     key={1}
    //     active={location.pathname === '/home'}
    //     as={Link}
    //     to={'/home'}
    //     text="Your profile"
    //   />,
    //   <Dropdown.item
    //     key={2}
    //     active={location.pathname === '/home'}
    //     as={Link}
    //     to={'/home'}
    //     text="Settings"
    //   />,
    //   <Dropdown.item
    //     key={3}
    //     active={location.pathname === '/home'}
    //     as={Link}
    //     to={'/home'}
    //     text="Help"
    //   />,
    //   <Dropdown.item
    //     key={4}
    //     active={location.pathname === '/home'}
    //     as={Link}
    //     to={'/home'}
    //     text="Settings"
    //     onClick={handleLogout}
    //   />,
    // ];

    const dropOptions = [
      { key: 1, text: 'Your profile', value: 1 },
      { key: 2, text: 'Settings', value: 2 },
      { key: 3, text: 'Help', value: 3 },
      { key: 4, text: 'Logout', value: 4 },
    ]

    const firstName = user.name ? user.name.split(' ')[0] : '';
    const dropTrigger = (
      <span>
        <Image avatar src={user.image} /> {firstName}
      </span>
    )

    return (
      <Menu floated fixed="top" secondary inverted style={this.styles.navbar}>
        <Menu.Menu style={this.styles.menuMenu} >
          <Menu.Item
            active={location.pathname === '/'}
            as={Link}
            to={'/'}
            style={this.styles.title}>
            WORDUP
          </Menu.Item>
          {isLoggedIn ?
            loggedInMenuOptions :
            null
          }
        </Menu.Menu>
        {isLoggedIn ? (
          <Menu.Menu position="right" style={this.styles.rightMenu}>
            <Menu.Item
              active={location.pathname === '/home'}
              as={Link}
              to={'/home'}>
              <Icon name="user" size="big" />
            </Menu.Item>
            <Dropdown trigger={dropTrigger} >
              <Dropdown.Menu>
                <Dropdown.item
                  key={1}
                  active={location.pathname === '/home'}
                  as={Link}
                  to={'/home'}
                  text="Your profile"
                />
                <Dropdown.item
                  key={2}
                  as={Link}
                  to={'/home'}
                  text="Settings"
                />
                <Dropdown.item
                  key={3}
                  as={Link}
                  to={'/home'}
                  text="Help"
                />
                <Dropdown.item
                  key={4}
                  text="Logout"
                  onClick={handleLogout}
                />
              </Dropdown.Menu>
            </Dropdown>
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
