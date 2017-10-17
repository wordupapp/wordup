import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Table, Header, Grid, Container, Icon, Button, Label } from 'semantic-ui-react';
import styles from './styles';

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
    <Grid.Column key={game.key} style={styles.buttonCol}>
      <Button
        icon as={Link}
        to={`/games/${game.ref}`}
        style={styles.gameButton}>
        <Container style={styles.gameContainer}>
          <Icon
            style={styles.gameIcon}
            name={game.icon}
            size="massive"
          />
          <Header as="h3" style={styles.gameLabel}>
            {game.name}
          </Header>
        </Container>
      </Button>
    </Grid.Column>
  ));

  const userLevelBlock = (
    <Container style={styles.rightContainerTop}>
      <Header as="h2" style={styles.subTitle}>
        {'Your level: '}
        <Label
          circular
          color="red"
          style={styles.levelNumber}>
          {level}
        </Label>
      </Header>
      <Container style={styles.levelContainer}>
        <Icon
          style={styles.levelIcon}
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
              <Header as="h1" style={styles.title}>
                Playground
              </Header>
              <Grid columns={3} doubling style={styles.gameGroup}>
                {gameButtons}
              </Grid>
            </Container>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Grid.Row >
              {userLevelBlock}
            </Grid.Row>
            <Grid.Row>
              <Container style={styles.rightContainerBot}>
                <Header as="h2" style={styles.subTitle}>Top scores</Header>
                <Table color="red">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Rank</Table.HeaderCell>
                      <Table.HeaderCell>Score</Table.HeaderCell>
                      <Table.HeaderCell style={styles.userCol}>User</Table.HeaderCell>
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
