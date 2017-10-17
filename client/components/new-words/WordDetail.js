import React from 'react';
import PropTypes from 'prop-types';

import { Label, Header, List, Segment, Icon } from 'semantic-ui-react';
import styles from './styles';

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
      return (
        <List.Description key={contentKey} style={styles.wordDetail.listItem}>
          <List.Icon name="bookmark" />
          {dispText}
        </List.Description>
      );
    });
    return (
      <List.Item key={contentKey}>
        <List.Header>
          <Label ribbon>
            {def.pos}
          </Label>
        </List.Header>
        {oneDefList}
      </List.Item>
    );
  });

  const exampleList = examples.map(example => {
    contentKey += 1;
    return (
      <List.Item key={contentKey} style={styles.wordDetail.listItem}>
        <List.Icon name="book" />
        {`"${example}"`}
      </List.Item>
    );
  });

  return (
    <div style={styles.wordDetail.all}>
      <Header as="h2" attached="top">
        <Icon name="book" />
        <Header.Content>
          {name}
          <Header.Subheader>
            {`definitions of ${name}:`}
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Segment attached color="red">
        {definitionList}
      </Segment>
      <Segment attached color="red">
        <Label ribbon>
          Examples
        </Label>
        {exampleList}
      </Segment>
    </div>
  );
};

export default WordDetail;
