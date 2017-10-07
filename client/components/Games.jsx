import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Grid, Container, Icon } from 'semantic-ui-react';

const styles = {
  all: {
    width: "100%",
    backgroundColor: "#e9e9e9",
  },
  container: {
    padding: "7em 0em",
    minWidth: "80%",
  },
  subContainer: {
    backgroundColor: "#ffffff",
    minHeight: "400px",
    padding: "2em",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  title: {
    fontSize: '5em',
    marginTop: '1em',
  },
  buttonCol: {
    marginTop: '10em',
  },
  buttonIcon: {
    fontSize: '10em',
    display: 'inline',
  },
};

const Games = props => {
  const seed = Math.floor(Math.random() * 100);
  const games = [
    { key: 0, name: 'Synonyms', ref: 'synonyms', icon: 'skyatlas' },
    { key: 1, name: 'Definitions', ref: `definitions/${seed}`, icon: 'telegram' },
    { key: 2, name: 'Examples', ref: 'fill-it-in', icon: 'space shuttle' },
    { key: 3, name: 'Chat Chat', ref: '', icon: 'wechat' },
    { key: 5, name: 'Word University', ref: '', icon: 'university' },
    { key: 6, name: 'Under Contruction', ref: '', icon: 'cogs' },
  ];

  const gameButtons = games.map(game => (
    <Grid.Column key={game.key} style={styles.buttonCol}>
      <Link to={`/games/${game.ref}`}>
        <Icon
          style={styles.buttonIcon}
          name={game.icon} />
        <Header as="h2" style={{ marginTop: '2em' }}>{game.name}</Header>
      </Link>
    </Grid.Column>
  ));

  return (
    <Container style={styles.all}>
      <Grid
        container
        stackable
        stretched
        relaxed
        style={styles.container}>
        <Grid.Row>
          <Grid.Column width={11}>
            <Container style={styles.subContainer}>
              <Header as="h1" style={styles.title}>Mini games!</Header>
              <Grid columns={3} doubling>
                {gameButtons}
              </Grid>
            </Container>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Grid.Row >
              <Container style={styles.subContainer}>
                Your level
              </Container>
            </Grid.Row>
            <Grid.Row>
              <Container style={styles.subContainer}>
                Top words you have spoken
              </Container>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Games;
