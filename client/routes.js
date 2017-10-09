/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Router} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import history from './history';
import {Main,
        Login,
        Signup,
        UserHome,
        Landing,
        Record,
        SynonymGame,
        Definitions,
        DataVisPanel,
        Games,
        NewWordsPanel,
      } from './components';
import {me} from './store';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <Router history={history}>
        <Main>
          <Switch>
            {
              isLoggedIn &&
                <Switch>
                  {/* Routes placed here are only available after logging in */}
                  <Route path="/home" component={UserHome} />
                  <Route path="/record" component={Record} />
                  <Route exact path="/games" component={Games} />
                  <Route path="/games/synonyms" component={SynonymGame} />
                  <Route path="games/definitions/:seed" component={Definitions} />
                  <Route path="/data" component={DataVisPanel} />
                  <Route path="/newwords" component={NewWordsPanel} />
                  <Route path="*" component={Landing} />
                </Switch>
            }
            {/* Routes placed here are available to all visitors */}
            <Route exact path="/" component={Landing} />
            <Route path="/login" component={Landing} />
            <Route path="/signup" component={Landing} />
            <Route path="*" component={Landing} />
          </Switch>
        </Main>
      </Router>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

export default connect(mapState, mapDispatch)(Routes);

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
