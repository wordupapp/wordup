import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Container, Header, Icon, Image, Grid, List, Table, Label } from 'semantic-ui-react';

/**
 * COMPONENT STYLE
 */
const style = {
  all: {
    width: "100%",
    backgroundColor: "#e9e9e9",
    flexGrow: 1,
  },
  container: {
    padding: "2em 0em 4em",
    minWidth: "60%",
  },
  leftContainer: {
    backgroundColor: "#ffffff",
    padding: "3em 2em",
    marginBottom: "4em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  rightContainerTop: {
    backgroundColor: "#ffffff",
    maxHeight: "380px",
    minWidth: "300px",
    padding: "2em",
    marginBottom: "3em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  rightContainerBot: {
    backgroundColor: "#ffffff",
    minWidth: "300px",
    padding: "2em",
    marginTop: "-2em",
    marginBottom: "3em",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,.04)",
    textAlign: "center",
  },
  userImage: {
    margin: '3em auto',
  },
  title: {
    fontSize: '3em',
    marginTop: '0.5em',
    fontFamily: "Fredoka One",
    fontWeight: 500,
  },
  subTitle: {
    fontSize: '2em',
    fontFamily: "Fredoka One",
    fontWeight: 200,
  },
  list: {
    fontSize: '1.5em',
    margin: '3em auto 2em',
    width: '50%',
  },
  emailLink: {
    color: '#2185d0',
  },
  editButton: {
    marginBottom: '1em',
    background: '#ffd600',
    color: '#2b282e',
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
};

/**
 * COMPONENT
 */
export const UserHome = props => {
  const { email, name, phone, level, words } = props;
  let { image } = props;
  const firstName = name ? name.split(' ')[0] : '';

  // default image
  if (!image) image = 'http://www.answerspoint.com/user/uploads/users/default_user.png';

  const userInfoBlock = (
    <Container style={style.leftContainer}>
      <Header as='h3' style={style.title}>
        Hello, {firstName}!
      </Header>
      <Image
        size="small"
        shape="circular"
        src={image}
        style={style.userImage}
      />
      <List style={style.list} >
        <List.Item>
          <List.Icon name='user' />
          <List.Content>{name}</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='marker' />
          <List.Content>Chicago, IL</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name='mail' />
          <List.Content>
            <a style={style.emailLink} href={`mailto$:${email}`}>
              {email}
            </a>
          </List.Content>
        </List.Item>
        {
          phone ?
            <List.Item>
              <List.Icon name='phone' />
              <List.Content>
                {phone}
              </List.Content>
            </List.Item> :
            null
        }
      </List>
      <Button size='huge' style={style.editButton}>
        Edit your profile
      </Button>
    </Container>
  );

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

  let topFiveWords = Object.keys(words).filter(word => (words[word].level > 0));
  topFiveWords = topFiveWords.sort((a, b) => (words[b].numUsed - words[a].numUsed));
  topFiveWords = topFiveWords.slice(0, 5).map((word, index) => ({
    name: word,
    level: words[word].level,
    numUsed: words[word].numUsed,
    rank: index + 1,
  }));

  const topWordTableRows = topFiveWords.map(word => (
    <Table.Row key={word.rank}>
      <Table.Cell>{word.rank}</Table.Cell>
      <Table.Cell>{word.name}</Table.Cell>
      <Table.Cell>{word.numUsed}</Table.Cell>
      <Table.Cell>{word.level}</Table.Cell>
    </Table.Row>
  ));

  const userTopWordsBlock = (
    <Container style={style.rightContainerBot}>
      <Header as="h2" style={style.subTitle}>Your top words</Header>
      <Table color="red">
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
  );

  return (
    <Container style={style.all}>
      <Grid
        container
        stackable
        stretched
        relaxed
        style={style.container}>
        <Grid.Row>
          <Grid.Column width={10}>
            {userInfoBlock}
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Grid.Row>
              {userLevelBlock}
            </Grid.Row>
            <Grid.Row>
              {userTopWordsBlock}
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
    email: state.user.email,
    name: state.user.name,
    phone: state.user.phone,
    image: state.user.image,
    level: state.userLevel,
    words: state.userWords,
  };
};

export default connect(mapState)(UserHome);

