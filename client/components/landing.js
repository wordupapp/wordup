import React from 'react'
import {withRouter, Link} from 'react-router-dom'

const containerStyles = {
  display: "flex",
  "align-items": "center",
};

const backgroundStyles = {
  height: "100vh",
  backgroundImage: "url(\"landing.jpg\")",
  backgroundSize: "cover",
  // opacity: ".65",
  width: "100%",
};

const headerStyles = {
  color: "#ffd600",
  width: "110px",
  "margin-left": "200px",
  position: "absolute",
};

const imgStyles = {
  "max-width": "100%",
  "max-height": "100%",
};

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
const Landing = props => {
  return (
    <div style={containerStyles}>
      <div style={backgroundStyles}>
        {/* <img src="landing.jpg" alt="landing.jpg" style={imgStyles} /> */}
      </div>
      <h3 style={headerStyles}>
        Lorem ipsum
        Lorem ipsum
        Lorem ipsum
      </h3>
    </div>
  );
};


// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(Landing);
