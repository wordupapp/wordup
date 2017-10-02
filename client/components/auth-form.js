import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Form, Message } from 'semantic-ui-react';
import {auth} from '../store';

/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    // <Splash>
      <Card centered raised>
        <Card.Content>
          <Card.Header textAlign="center">
            <h2>{displayName}</h2>
          </Card.Header>
          <Form onSubmit={handleSubmit} name={name}>
            <Form.Input label="Email" name="email" type="email" />
            <Form.Input label="Password" name="password" type="password" />
            <Form.Button fluid>Submit</Form.Button>
            {error && error.response && <Message negative> {error.response.data} </Message>}
          </Form>
        </Card.Content>
        <Card.Content extra textAlign="center">
          <a href="/auth/google">{displayName} with Google</a>
        </Card.Content>
      </Card>
    // </Splash>
    // <div>
    //   <form onSubmit={handleSubmit} name={name}>
    //     <div>
    //       <label htmlFor='email'><small>Email</small></label>
    //       <input name='email' type='text' />
    //     </div>
    //     <div>
    //       <label htmlFor='password'><small>Password</small></label>
    //       <input name='password' type='password' />
    //     </div>
    //     <div>
    //       <button type='submit'>{displayName}</button>
    //     </div>
    //     {error && error.response && <div> {error.response.data} </div>}
    //   </form>
    //   <a href='/auth/google'>{displayName} with Google</a>
    // </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
