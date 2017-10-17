const styles = {
  panel: {
    all: {
      width: "100%",
      backgroundColor: "#e9e9e9",
      flexGrow: 1,
    },
    container: {
      padding: "2em 0em 4em",
      // minWidth: "60%",
    },
    subContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 0 25px rgba(0,0,0,.04)",
      textAlign: "center",
    },
    iconHeader: {
      marginTop: "1em",
      fontSize: '2em',
      fontFamily: "Fredoka One",
      fontWeight: 500,
    },
  },
  wordDetail: {
    all: {
      margin: '3em auto',
      textAlign: 'left',
      maxWidth: '70%',
      paddingBottom: '8em',
    },
    listItem: {
      margin: '1em',
    },
  },
  levelWords: {
    buttonGroup: {
      padding: '3em 5em 4em 5em',
    },
    infoMessage: {
      maxWidth: '33%',
      margin: '3em auto 0 auto',
      background: '#2b282e',
      color: '#fff',
    },
    wordButton: {
      background: '#ffd600',
      color: '#2b282e',
    },
  },
}

export default styles;
