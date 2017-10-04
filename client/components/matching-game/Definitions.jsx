/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

/**
 * STYLES
 */
const styles = {
  container: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  definitions: {
    // marginTop: "100px",
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
      <Container style={styles.container}>
        <Header as="h1">Match the correct word to the definition:</Header>
        <div style={styles.definitions}>hello!</div>
      </Container>
    );
  }
}

export default withRouter(Definitions);
