import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header, Container, Menu, Icon } from 'semantic-ui-react';

import history from '../../history';
import LevelWordView from './LevelWords';
import OhterUserWordView from './OtherUserWords';
import styles from './styles';


export class NewWordsPanel extends React.Component {
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
      <Container style={styles.panel.all}>
        <Container style={styles.panel.container}>
          <Container style={styles.panel.subContainer}>
            <Header as="h1" className="panelHeader" icon style={styles.panel.iconHeader}>
              <Icon name="graduation" />
              <Header.Content className="panelHeaderContent">
                <span>Learn new words</span>
                <Header.Subheader className="panelSubHeaderContent">
                  <span>learn and up your vocabulary game!</span>
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Menu pointing secondary size="massive">
              <Menu.Item
                name="level"
                active={activeItem === "level"}
                onClick={this.handleMenuClick}
                as={Link}
                to="/newwords/level"
              />
              <Menu.Item
                name="user"
                active={activeItem === "user"}
                onClick={this.handleMenuClick}
                as={Link}
                to="/newwords/user"
              />
              <Menu.Item
                name="extra"
                active={activeItem === "extra"}
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
