/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Menu } from 'semantic-ui-react';
// import history from '../history';
import { DataVisWordCloud, DataVisLevelCloud, DataVisUsageTrends } from '../components';

/**
 * COMPONENT
 */
class DataVisPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.links = [
      { url: '/data/1', name: 'Your Word Cloud' },
      { url: '/data/2', name: 'Your Level Cloud' },
      { url: '/data/3', name: 'Top Word Usage Trends' },
    ];
  }

  render() {
    return (
      <Grid>
        <Grid.Column width={3}>
          {
            <Menu fluid vertical pointing>
              {this.links.map((link) => (
                <Menu.Item
                  key={link.name}
                  name={link.name}
                  active={
                    this.props.location.pathname === link.url
                  }
                  as={Link}
                  to={link.url}>
                  {link.name}
                </Menu.Item>
              ))}
            </Menu>
          }
        </Grid.Column>
         <Grid.Column stretched width={12}>
           {(this.props.location.pathname === '/data/1' || this.props.location.pathname === '/data') && <DataVisWordCloud />}
          {/* {this.props.location.pathname === '/data/2' && <DataVisLevelCloud />}
          {this.props.location.pathname === '/data/3' && <DataVisUsageTrends />} */}
        </Grid.Column>
      </Grid>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state, ownProps) => {
  return {
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(DataVisPanel));

/**
 * PROP TYPES
 */
DataVisPanel.propTypes = {
};
