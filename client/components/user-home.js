import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Container, Header, Icon, Image, Segment, Grid, List, Table, Card } from 'semantic-ui-react';

/**
 * COMPONENT STYLE
 */
const style = {
  levelIcon: {
    display: 'inline-block',
  },
  level: {
    color: 'red',
  },
};

/**
 * COMPONENT
 */
export const UserHome = props => {
  const { email, name, phone, level, suggestedWords } = props;
  let { image } = props;
  const firstName = name.split(' ')[0];

  // default image
  if (!image) image = 'http://www.answerspoint.com/user/uploads/users/default_user.png';

  return (
    <div>
      {/* REVIEW: Hey, put this is your style object */}
      <Segment vertical style={{ padding: '6em 0em' }}>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={6}>
              <Image
                bordered
                size='large'
                src={image}
              />
            </Grid.Column>
            <Grid.Column width={8} floated='right' >
              <Header as='h3' style={{ fontSize: '3em' }}>
                Hello, {firstName}!
              </Header>
              <List style={{ fontSize: '1.5em' }}>
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
                    <a href={`mailto$:${email}`}>
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
              <Button size='huge'>Edit your profile</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: '5em' }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: '1.5em' }}>
            <Icon name="check square" style={style.levelIcon} />
            <span>Your Vocab Level: </span>
            <span style={style.level} >{level}</span>
          </Header>
          <p style={{ fontSize: '1.2em' }}>
            {`Based on words you have spoken, we calculate that your vocabulary level is ${level}!`}
          </p>
        </Container>
      </Segment>
      <Segment style={{ padding: '6em 12em' }} vertical>
        <Table color="red" key="red">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Ranking</Table.HeaderCell>
              <Table.HeaderCell>Scores</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>2600</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>2</Table.Cell>
              <Table.Cell>2310</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>3</Table.Cell>
              <Table.Cell>1810</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>
    </div>
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
  };
};

export default connect(mapState)(UserHome);

