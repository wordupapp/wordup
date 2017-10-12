/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Form, Message, Button, Icon } from 'semantic-ui-react';
import { auth } from '../store';

const authStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0em auto 15em",
};

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div style={authStyles}>
      <Card centered raised>
        <Card.Content>
          <Card.Header as="h2" textAlign="center">
            {displayName}
          </Card.Header>
          <Form onSubmit={handleSubmit} name={name}>
            {displayName === 'Sign Up' ?
              <Form.Input label="Name" name="userName" type="userName" /> :
              null
            }
            <Form.Input label="Email" name="email" type="email" />
            <Form.Input label="Password" name="password" type="password" />
            <Form.Button fluid>Submit</Form.Button>
            {error && error.response && <Message negative> {error.response.data} </Message>}
          </Form>
        </Card.Content>
        <Card.Content extra textAlign="center">
          <Button
            color="google plus"
            as="a"
            href="/auth/google">
            <Icon name="google plus" /> {displayName} with Google
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      const userName = (formName === 'signup') ? evt.target.userName.value : '';

      dispatch(auth(email, password, formName, userName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
