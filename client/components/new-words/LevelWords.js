import React from 'react';
import { connect } from 'react-redux';

import { Card, List, Header } from 'semantic-ui-react';

import WordCard from './WordInfoCard';

/**
 * COMPONENT STYLE
 */
const style = {
};

/**
 * COMPONENT
 */
export const LevelWords = props => {
  const { suggestedWords } = props;

  let cardKey = 0;
  const suggestionCards = suggestedWords ? suggestedWords.map((word, index) => {
    cardKey += 1;
    return <WordCard key={cardKey} word={word} />;
  }) : null;

  return (
    <Card.Group itemsPerRow={3} stackable>
      {suggestionCards}
    </Card.Group>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    suggestedWords: [...state.userSuggestedWords],
  };
};

export default connect(mapState)(LevelWords);
