import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Table, Header, Grid, Container, Icon, Button, Label } from 'semantic-ui-react';

const style = {
  all: {
    width: "100%",
    backgroundColor: "#e9e9e9",
    flexGrow: 1,
  },
  container: {
    padding: "4em 0em",
    minWidth: "65%",
  },
  leftContainer: {
    backgroundColor: "#ffffff",
    padding: "2em",
    marginBottom: "4em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  rightContainerTop: {
    backgroundColor: "#ffffff",
    maxHeight: "380px",
    minWidth: "330px",
    padding: "2em",
    marginBottom: "3em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  rightContainerBot: {
    backgroundColor: "#ffffff",
    minWidth: "330px",
    padding: "2em",
    marginTop: "-2em",
    marginBottom: "3em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  title: {
    fontSize: '4em',
    marginTop: '0.5em',
    fontFamily: "Fredoka One",
    fontWeight: 500,
  },
  subTitle: {
    fontSize: '2em',
    fontFamily: "Fredoka One",
    fontWeight: 200,
  },
  gameGroup: {
    margin: '2.5em auto 1em',
  },
  buttonCol: {
    margin: '0.6em auto',
  },
  gameContainer: {
    marginTop: '0.6em',
  },
  gameButton: {
    height: '13.5em',
    width: '13.5em',
    background: '#2b282e',
  },
  gameIcon: {
    margin: 'auto',
    color: '#ffd600',
  },
  gameLabel: {
    margin: '0.8em auto 0 auto',
    color: '#ffd600',
  },
  levelContainer: {
    marginTop: '6em',
    marginBottom: '-5em',
  },
  levelIcon: {
    fontSize: '11em',
    display: 'inline-block',
    position: 'relative',
    color: '#ffd600',
  },
  levelNumber: {
    fontWeight: 100,
    fontSize: '0.6em',
  },
  userCol: {
    minWidth: '8em',
  },
};

const Games = props => {
  const { level } = props;

  const seed = Math.floor(Math.random() * 100);
  const games = [
    { key: 0, name: 'Synonym Matching', ref: 'synonyms', icon: 'cloud' },
    { key: 1, name: 'Definitions', ref: `definitions/${seed}`, icon: 'telegram' },
    { key: 2, name: 'Examples', ref: 'fill-it-in', icon: 'bookmark' },
    { key: 3, name: 'Chat Chat', ref: '', icon: 'wechat' },
    { key: 5, name: 'Word School', ref: '', icon: 'pencil' },
    { key: 6, name: 'Under Contruction', ref: '', icon: 'cogs' },
  ];

  const gameButtons = games.map(game => (
    <Grid.Column key={game.key} style={style.buttonCol}>
      <Button
        icon as={Link}
        to={`/games/${game.ref}`}
        style={style.gameButton}>
        <Container style={style.gameContainer}>
          <Icon
            style={style.gameIcon}
            name={game.icon}
            size="massive"
          />
          <Header as="h3" style={style.gameLabel}>
            {game.name}
          </Header>
        </Container>
      </Button>
    </Grid.Column>
  ));

  const userLevelBlock = (
    <Container style={style.rightContainerTop}>
      <Header as="h2" style={style.subTitle}>
        {'Your level: '}
        <Label
          circular
          color="red"
          style={style.levelNumber}>
          {level}
        </Label>
      </Header>
      <Container style={style.levelContainer}>
        <Icon
          style={style.levelIcon}
          name={'trophy'}
        />
      </Container>
    </Container>
  );

  // TODO: fake datat for now!
  const topScoresArr = [
    {
      rank: 1,
      score: 140,
      userName: 'Louis',
      userLevel: 9,
      userImage: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/67.png',
    },
    {
      rank: 2,
      score: 135,
      userName: 'Maggie',
      userLevel: 7,
      userImage: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/98.png',
    },
    {
      rank: 3,
      score: 100,
      userName: 'Tyler',
      userLevel: 8,
      userImage: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/128.png',
    },
    {
      rank: 4,
      score: 99,
      userName: 'Eva',
      userLevel: 8,
      userImage: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/103.png',
    },
    {
      rank: 5,
      score: 98,
      userName: 'Mabelle',
      userLevel: 6,
      userImage: ' https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/30.png',
    },
  ]

  const topScoreTableRows = topScoresArr.map(score => (
    <Table.Row key={score.rank}>
      <Table.Cell>{score.rank}</Table.Cell>
      <Table.Cell>{score.score}</Table.Cell>
      <Table.Cell>
        <Label image>
          <img src={score.userImage} alt={score.userName} />
          {score.userName}
        </Label>
      </Table.Cell>
      <Table.Cell>{score.userLevel}</Table.Cell>
    </Table.Row>
  ))

  return (
    <Container style={style.all}>
      <Grid
        container
        stackable
        stretched
        relaxed
        style={style.container}>
        <Grid.Row>
          <Grid.Column width={11}>
            <Container style={style.leftContainer}>
              <Header as="h1" style={style.title}>
                Playground
              </Header>
              <Grid columns={3} doubling style={style.gameGroup}>
                {gameButtons}
              </Grid>
            </Container>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Grid.Row >
              {userLevelBlock}
            </Grid.Row>
            <Grid.Row>
              <Container style={style.rightContainerBot}>
                <Header as="h2" style={style.subTitle}>Top scores</Header>
                <Table color="red">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Rank</Table.HeaderCell>
                      <Table.HeaderCell>Score</Table.HeaderCell>
                      <Table.HeaderCell style={style.userCol}>User</Table.HeaderCell>
                      <Table.HeaderCell>Level</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {topScoreTableRows}
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
  };
};

export default connect(mapState)(Games);
