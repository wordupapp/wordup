import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Container, Header, Icon, Image, Grid, List, Table, Label } from 'semantic-ui-react';
import styles from './styles';

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
    <Container style={styles.leftContainer}>
      <Header as='h3' style={styles.title}>
        Hello, {firstName}!
      </Header>
      <Image
        size="small"
        shape="circular"
        src={image}
        style={styles.userImage}
      />
      <List style={styles.list} >
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
            <a style={styles.emailLink} href={`mailto$:${email}`}>
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
      <Button size='huge' style={styles.editButton}>
        Edit your profile
      </Button>
    </Container>
  );

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
    <Container style={styles.rightContainerBot}>
      <Header as="h2" style={styles.subTitle}>Your top words</Header>
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
    <Container style={styles.all}>
      <Grid
        container
        stackable
        stretched
        relaxed
        style={styles.container}>
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

