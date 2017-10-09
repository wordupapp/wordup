import React from 'react';
import { connect } from 'react-redux';

import { Container, Grid, Header, Button } from 'semantic-ui-react';

import WordDetailPage from './WordDetail';

/**
 * COMPONENT STYLE
 */
const styles = {
  buttonGroup: {
    padding: '2em 5em',
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
    const { suggestedWords } = this.props;

    const selectedWord = this.state.activeItem === '' ?
      null :
      (
        suggestedWords.find(word => word.name === this.state.activeItem)
      );

    let cardKey = 0;
    const suggestionButtons = suggestedWords ?
      suggestedWords.map((word, index) => {
        cardKey += 1;
        return (
          <Grid.Column key={cardKey}>
            <Button
              primary
              value={word.name}
              onClick={this.handleMenuClick}
              size="massive">
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
                {/* REVIEW does this need to be backticks? */}
                <Header as="h1">{`These are words you haven't tried`}</Header>
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
    suggestedWords: [...state.userSuggestedWords],
  };
};

export default connect(mapState)(OtherUserWords);
