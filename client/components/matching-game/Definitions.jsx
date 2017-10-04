/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Checkbox, Container, Form, Header } from 'semantic-ui-react';

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
  navContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    padding: "0em 3em",
    marginTop: "80px",
  },
  nav: {
    margin: "0",
  },
  score: {
    marginTop: "4em",
  }
}


/**
 * COMPONENT
 */
class Definitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "",
      correct: 0,
      total: 10,
    };

    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
  }

  handleChangeOption(e, option){
    this.setState({ option: option.value })
    console.log("option.value", option.value);
  }

  handleClickPrev(e){
    // this.setState({ option: e.target.value })
    console.log("PREV");
  }

  handleClickNext(e){
    // this.setState({ option: e.target.value })
    console.log("NEXT");
  }

  render() {
    let { option, correct, total } = this.state;

    return (
      <Container style={styles.container}>
        <Header as="h2" style={styles.score}>Score: {correct}/{total} </Header>
        <Header as="h1">Match the correct word to the definition:</Header>
        <Header as="h3">Definition: [text of the definition goes here]</Header>
        <Form>
          <Form.Field>
            <Checkbox
              radio
              label={"option 1"}
              name="checkboxRadioGroup"
              value="option 1"
              checked={ option === "option 1" }
              onChange={ this.handleChangeOption }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label={"option 2"}
              name="checkboxRadioGroup"
              value="option 2"
              checked={ option === "option 2" }
              onChange={ this.handleChangeOption }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label={"option 3"}
              name="checkboxRadioGroup"
              value="option 3"
              checked={ option === "option 3" }
              onChange={ this.handleChangeOption }
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label={"option 4"}
              name="checkboxRadioGroup"
              value="option 4"
              checked={ option === "option 4" }
              onChange={ this.handleChangeOption }
            />
          </Form.Field>

        </Form>
        <div style={styles.navContainer}>
          <h3 style={styles.nav} onClick={this.handleClickPrev}>PREV</h3>
          <h3 style={styles.nav} onClick={this.handleClickNext}>NEXT</h3>
        </div>
      </Container>
    );
  }
}

export default withRouter(Definitions);