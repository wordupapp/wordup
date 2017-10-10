import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header, Container, Menu } from 'semantic-ui-react';

import history from '../../history';
import LevelWordView from './LevelWords';
import OhterUserWordView from './OtherUserWords';

const styles = {
  all: {
    width: "100%",
    backgroundColor: "#e9e9e9",
  },
  container: {
    padding: "7em 0em",
    minWidth: "80%",
  },
  subContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
};

class NewWordsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'level',
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  render() {
    const { activeItem } = this.state;

    return (
      <Container style={styles.all}>
        <Container style={styles.container}>
          <Container style={styles.subContainer}>
            <Header as='h1'>Learn new words</Header>
            <Menu pointing secondary size='massive'>
              <Menu.Item
                name='level'
                active={activeItem === 'level'}
                onClick={this.handleMenuClick}
                as={Link}
                to="/newwords/level"
              />
              <Menu.Item
                name='user'
                active={activeItem === 'user'}
                onClick={this.handleMenuClick}
                as={Link}
                to="/newwords/user"
              />
              <Menu.Item
                name='extra'
                active={activeItem === 'extra'}
                onClick={this.handleMenuClick}
                as={Link}
                to="/newwords/extra"
              />
            </Menu>
            <Router history={history}>
              <Switch>
                <Route exact path="/newwords" component={LevelWordView} />
                <Route path="/newwords/level" component={LevelWordView} />
                <Route path="/newwords/user" component={OhterUserWordView} />
                <Route path="*" component={LevelWordView} />
              </Switch>
            </Router>
          </Container>
        </Container>
      </Container>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = null;

export default connect(mapState)(NewWordsPanel);
