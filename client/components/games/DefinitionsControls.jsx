/* eslint-disable */

// NODE MODULES
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Chance from 'chance';
import { Button, Form, Header, Icon } from 'semantic-ui-react';


/**
 * STYLES
 */
const styles = {
  navContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0em 3em",
    marginTop: "80px",
  },
  nav: {
    margin: "0",
  },
  skip: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "1em",
    width: "6em",
  },
  correct: {
    width: "-webkit-fill-available",
    padding: "1em 2em",
    display: "flex",
    justifyContent: "space-between",
    background: "#bff199",
    color: "#65ab00",
  },
  incorrect: {
    width: "-webkit-fill-available",
    padding: "1em 2em",    
    display: "flex",
    justifyContent: "space-between",    
    background: "#ffd3d1",
    color: "#e70800",
  },
}

// export const SkipOrSubmit = ({ choice, next, response } = props) => {
//   if(!response) {
//     return (
//       <div style={styles.navContainer}>
//         <Button style={styles.nav} onClick={next}>Skip</Button>
//         <Form.Button
//           disabled={!choice ? true : false}
//           color={choice ? "green" : "grey"}
//           style={styles.nav}
//           >Submit
//         </Form.Button>
//       </div>
//     )
//   } else {
//     return null;
//   }
// }

export const Skip = ({ next, response } = props) => {
  if(!response) {
    return (
      <div className="skip" style={styles.skip} onClick={next}>Skip</div>
    )
  } else {
    return null;
  }
}

export const Submit = ({ choice, response } = props) => {
  if(!response) {
    return (
      <Form.Button
        disabled={!choice ? true : false}
        color={choice ? "green" : "grey"}
        style={styles.nav}
        >Submit
      </Form.Button>
    )
  } else {
    return null;
  }
}

export const NextQuestion = ({ next, response } = props) => {
  if(response === 'correct') {
    return(
    <div style={styles.correct}>
      <h3> Correct! <Icon name="thumbs up" /> </h3>
      <Button color="purple" style={styles.nav} onClick={next}>Next</Button>
    </div>
    )
  } else if(response === 'incorrect') {
    return(
    <div style={styles.incorrect}>
      <h3 style={styles.nav}> Incorrect! <Icon name="frown" /> </h3>      
      <Button color="purple" style={styles.nav} onClick={next}>Next</Button>
    </div>
    )
  } else {
    return null;
  }
}
