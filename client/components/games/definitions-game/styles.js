/**
 * STYLES
 */

const styles = {
  fullScreen: {
    background: "#ffd600",
    height: "-webkit-fill-available",
  },
  container: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    flexDirection: "column",
    listStyleType: "none",
  },
  form: {
    width: "37em",
  },
  listItem: {
    lineHeight: "2.5em",
  },
  navContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0em 3em",
    marginTop: "2em",
  },
  nav: {
    margin: "0",
  },
  definitionsList: {
    display: "flex",
    justifyContent: "left",
    flexDirection: "column",
    width: "-webkit-fill-available",
    marginBottom: "1em",
  },
  score: {
    marginTop: "2em",
  },
  selected: {
    borderStyle: "solid",
    borderColor: "rgb(180, 19, 236)",
    borderRadius: "5px",
    borderWidth: "thick",
    padding: "9px",
  },
  showCorrect: {
    borderStyle: "solid",
    borderColor: "springgreen",
    borderRadius: "5px",
    borderWidth: "thick",
  },
}

export default styles;
