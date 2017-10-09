import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Header, Grid, Container, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

const styles = {
  all: {
    width: "100%",
    backgroundColor: "#e9e9e9",
  },
  container: {
    padding: "7em 0em",
    minWidth: "80%",
  },
  leftContainer: {
    backgroundColor: "#ffffff",
    padding: "2em",
    marginBottom: "4em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  rightContainer: {
    backgroundColor: "#ffffff",
    maxHeight: "380px",
    minWidth: "300px",
    padding: "2em",
    marginBottom: "4em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  title: {
    fontSize: '4em',
    marginTop: '0.5em',
  },
  buttonCol: {
    marginTop: '10em',
  },
  buttonIcon: {
    fontSize: '10em',
    display: 'inline',
  },
  subTitle: {
    fontSize: '2em',
  },
  levelContainer: {
    marginTop: '11em',
  },
  levelIcon: {
    fontSize: '15em',
    display: 'inline-block',
    position: 'relative',
    color: '#4183c4',
  },
  levelNumaber: {
    fontSize: '6em',
    color: '#fff',
    display: 'inline-block',
    position: 'absolute',
    top: '22.5%',
    left: '43.5%',
  },
};

const Games = props => {
  const { level, words } = props;

  const seed = Math.floor(Math.random() * 100);
  const games = [
    { key: 0, name: 'Synonyms', ref: 'synonyms', icon: 'skyatlas' },
    { key: 1, name: 'Definitions', ref: `definitions/${seed}`, icon: 'telegram' },
    { key: 2, name: 'Examples', ref: 'fill-it-in', icon: 'game' },
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

  let topFiveWords = Object.keys(words).sort((a, b) => (words[b].numUsed - words[a].numUsed));
  topFiveWords = topFiveWords.slice(0, 5).map((word, index) => ({
    name: word,
    level: words[word].level,
    numUsed: words[word].numUsed,
    rank: index + 1,
  }));
  console.log('TOP WORDS!!', topFiveWords)

  const topWordTableRows = topFiveWords.map(word => (
    <Table.Row key={word.rank}>
      <Table.Cell>{word.rank}</Table.Cell>
      <Table.Cell>{word.name}</Table.Cell>
      <Table.Cell>{word.numUsed}</Table.Cell>
      <Table.Cell>{word.level}</Table.Cell>
    </Table.Row>
  ))

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
            <Container style={styles.leftContainer}>
              <Header as="h1" style={styles.title}>Mini games</Header>
              <Grid columns={3} doubling>
                {gameButtons}
              </Grid>
            </Container>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Grid.Row >
              <Container style={styles.rightContainer}>
                <Header as="h2" style={styles.subTitle}>Your level</Header>
                <Container style={styles.levelContainer}>
                  <Icon
                    style={styles.levelIcon}
                    name={'trophy'}
                  />
                  <span style={styles.levelNumaber}>{level}</span>
                </Container>
              </Container>
            </Grid.Row>
            <Grid.Row>
              <Container style={styles.rightContainer}>
                <Header as="h2" style={styles.subTitle}>Your top words</Header>
                <Table basic>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Rank</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell># Used</Table.HeaderCell>
                      <Table.HeaderCell>Level</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {topWordTableRows}
                  </Table.Body>
                </Table>
              </Container>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    level: state.userLevel,
    words: state.userWords,
  };
};

export default connect(mapState)(Games);
