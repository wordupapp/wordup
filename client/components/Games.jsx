import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexFlow: "column wrap",
    height: "90vh",
    margin: "atuo",    
  },
  content: {
    backgroundColor: "green",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexFlow: "row wrap",    
    height: "30em",
  },
  item: {
    // borderRadius: "300px",
    height: "20em",
    width: "20em",
    margin: "1em",
  },
}

const Games = props => {
  let seed = Math.floor(Math.random() * 100);
  
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Link to="/games/synonyms">
          <Button circular style={styles.item}>
            <Header as="h2">Synonym Matching</Header>
          </Button>
        </Link>
        <Link to="/games/fill-it-in">
          <Button circular style={styles.item}>
            <Header as="h2">Fill it in!</Header>
          </Button>
        </Link>
        <Link to={`/games/definitions/${seed}`}>
          <Button circular style={styles.item}>
            <Header as="h2">Definition Matching</Header>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Games;
