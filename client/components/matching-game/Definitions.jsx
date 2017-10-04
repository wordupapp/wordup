/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Card, Form, Message } from 'semantic-ui-react';

/**
 * STYLES
 */
const styles = {
  definitions: {
    marginTop: "100px",
  },
}


/**
 * COMPONENT
 */
class Definitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    };
  }

  render() {
    return (
      <div style={styles.definitions}>hello!</div>
    );
  }
}

export default withRouter(Definitions);
