import React from 'react';
import PropTypes from 'prop-types';

import { Container, Header, List } from 'semantic-ui-react';

/**
 * COMPONENT STYLE
 */
const style = {
};

/**
 * COMPONENT
 */
export const WordDetail = props => {

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

  const exampleList = examples.map(example => {
    contentKey += 1;
    return (
      <List.Item key={contentKey}>
        <List.Icon name="book" />
        {example}
      </List.Item>
    );
  });

  return (
    <Container>
      <Header as="h2">{name}</Header>
      {definitionList}
      {exampleList}
    </Container>
  );
};

export default WordDetail;
