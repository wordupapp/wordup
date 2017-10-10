import React from 'react';
import { connect } from 'react-redux';

import { Container, Grid, Message, Button } from 'semantic-ui-react';

import WordDetailPage from './WordDetail';

/**
 * COMPONENT STYLE
 */
const styles = {
  buttonGroup: {
    padding: '3em 5em 4em 5em',
  },
  infoMessage: {
    maxWidth: '42%',
    margin: '3em auto 0 auto',
    background: '#2b282e',
    color: '#fff',
  },
  wordButton: {
    background: '#ffd600',
    color: '#2b282e',
  },
};

/**
 * COMPONENT
 */
class OtherUserWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleMenuClick(e) {
    this.setState({ activeItem: e.target.value });
  }

  handleBackClick(e) {
    this.setState({ activeItem: '' });
  }

  render() {
    const { userOtherWords } = this.props;

    const selectedWord = this.state.activeItem === '' ?
      null :
      (
        userOtherWords.find(word => word.name === this.state.activeItem)
      );

    let cardKey = 0;
    const suggestionButtons = userOtherWords ?
      userOtherWords.map((word, index) => {
        cardKey += 1;
        return (
          <Grid.Column key={cardKey}>
            <Button
              primary
              value={word.name}
              onClick={this.handleMenuClick}
              size="massive"
              style={styles.wordButton}>
              {word.name}
            </Button>
          </Grid.Column>
        );
      }) :
      null;

    return (
      <Container>
        {
          this.state.activeItem === '' ?
            (
              <Container>
                <Message
                  icon="commenting"
                  header="Word suggestions based on other users"
                  content="Other users who use same words as you also use these high level words."
                  style={styles.infoMessage}
                />
                <Grid columns={3} stackable style={styles.buttonGroup}>
                  {suggestionButtons}
                </Grid>
              </Container>
            ) :
            (
              <Container>
                <Button
                  secondary
                  onClick={this.handleBackClick}>
                  Back
                </Button>
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
    userOtherWords: [...state.userOtherWords],
  };
};

export default connect(mapState)(OtherUserWords);
