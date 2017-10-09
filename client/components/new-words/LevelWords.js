import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Container, Card, Header, Button } from 'semantic-ui-react';

import WordDetailPage from './WordDetail';

/**
 * COMPONENT STYLE
 */
const styles = {
  cardGroup: {
    padding: '2em 5em',
  },
};

/**
 * COMPONENT
 */

class LevelWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick(e) {
    this.setState({ activeItem: e.target.value });
  }

  render() {
    const { suggestedWords } = this.props;

    let cardKey = 0;
    const suggestionCards = suggestedWords ? suggestedWords.map((word, index) => {
      cardKey += 1;
      return (
        <Card
          key={cardKey}
          as={Button}
          value={word.name}
          onClick={this.handleMenuClick} >
          <Card.Content header={word.name} />
        </Card>);
    }) : null;

    const selectedWord = this.state.activeItem === '' ?
      null :
      (
        suggestedWords.find(word => word.name === this.state.activeItem)
      );

    return (
      <Container>
        {
          this.state.activeItem === '' ?
            (
              <Container>
                <Header as="h1">{`These are words you haven't tried`}</Header>
                <Card.Group itemsPerRow={2} stackable style={styles.cardGroup}>
                  {suggestionCards}
                </Card.Group>
              </Container>
            ) :
            (
              <Container>
                <Button as={Link} to="/newords/level" label="Back" />
                <WordDetailPage word={selectedWord} />
              </Container>
            )
        }
      </Container>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    suggestedWords: [...state.userSuggestedWords],
  };
};

export default connect(mapState)(LevelWords);
