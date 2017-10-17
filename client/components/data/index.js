/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Menu, Container } from 'semantic-ui-react';
// import history from '../history';
import { DataVisUsageTrends } from './DataVisUsageTrends';
import { DataVisWordCloud } from './DataVisWordCloud';
import styles from './styles';

/**
 * COMPONENT
 */
class DataVisPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.links = [
      { url: '/data/1', name: 'Your Word Cloud' },
      { url: '/data/2', name: 'Top Word Usage Trends' },
    ];
  }

  render() {
    return (
      <Container
        fluid
        style={styles.all}>
        <Grid
          stackable
          style={styles.container}>
          <Grid.Column
            style={styles.menuColumn}
            width={3}>
            {
              <Menu vertical pointing>
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
             {this.props.location.pathname === '/data/2' && <DataVisUsageTrends />}
          </Grid.Column>
        </Grid>
      </Container>
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
