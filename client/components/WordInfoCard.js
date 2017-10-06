import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Icon, List, Header } from 'semantic-ui-react';

/**
 * COMPONENT STYLE
 */
const style = {
};

/**
 * COMPONENT
 */
export const UserHome = props => {
  const { word } = props;
  const { name, definitions, examples } = word;
  let contentKey = 0;

  const definitionList = definitions.map(def => {
    contentKey += 1;
    const oneDefList = def.text.split('\n').map(text => {
      contentKey += 1;
      const dispText = text.split(')').slice(1).join('');
      return (<List.Description key={contentKey}>
        <List.Icon name="bookmark" />
        {dispText}
      </List.Description>);
    });
    return (
      <List.Item key={contentKey}>
        <List.Header>{def.pos}</List.Header>
        {oneDefList}
      </List.Item>
    );
  });

  const exampleList = examples.slice(0, 3).map(example => {
    contentKey += 1;
    return (
      <List.Item key={contentKey}>
        <List.Icon name="book" />
        {example}
      </List.Item>
    );
  });

  return (
    <Card style={{ fontSize: 'large' }}>
      <Card.Content header={name} style={{ fontSize: 'xx-large', textAlign: 'center', maxHeight: '110px' }} />
      <Card.Content>
        <List>
          <Header>Definitions: </Header>
          {definitionList}
        </List>
      </Card.Content>
      <Card.Content>
        <List>
          <Header>Examples: </Header>
          {exampleList}
        </List>
      </Card.Content>
    </Card>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
  };
};

export default connect(mapState)(UserHome);
