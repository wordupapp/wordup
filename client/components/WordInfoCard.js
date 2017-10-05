import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Icon, List } from 'semantic-ui-react';

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
  const { name, definitions, examples, relations } = word;
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
    <Card>
      <Card.Content header={name} />
      <Card.Content>
        <List>
          {definitionList}
        </List>
      </Card.Content>
      <Card.Content>
        <List>
          <List.Header>Examples: </List.Header>
          {exampleList}
        </List>
      </Card.Content>
      <Card.Content extra>
        <Icon name='wpexplorer' />
        Related words go here!
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
