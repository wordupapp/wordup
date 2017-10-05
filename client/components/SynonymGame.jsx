import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Layer, Stage, Text } from 'react-konva';
import { fetchRandWordAndRelatedWords } from '../store/words';

class SynonymGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userScore: 0,
      opponentScore: 0,
      gameWords: [],
      currentWord: '',
      level: 7,
      questionNum: 0,
    };
    this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderNewWord = this.renderNewWord.bind(this);
    this.randomNumber = this.randomNumber.bind(this);
  }

  componentWillMount() {
    for (let i = 0; i <= 5; i += 1) {
      this.props.dispatchGetRelatedWords(this.state.level);
    }
  }

  handleClick(event) {
    const clickedWord = event.target.attrs.text;
    const currentWordSynonyms = this.props.gameWords[this.state.currentWord];
    let newScore;
    if (currentWordSynonyms.indexOf(clickedWord) === -1) {
      newScore = this.state.userScore - 1;
    } else {
      newScore = this.state.userScore + 1;
    }
    this.setState({
      userScore: newScore,
    });
  }

  startGame() {
    const wordArr = Object.keys(this.props.gameWords);
    this.setState({
      gameWords: wordArr,
      currentWord: wordArr[0],
    });
  }

  renderNewWord() {
    this.setState({
      currentWord: this.state.gameWords[this.state.questionNum],
    });
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render() {
    const styles = {
      title: {
        marginTop: 50,
      },
      button: {
        backgroundColor: "#0a00b6",
        color: "#ffffff",
        margin: "auto",
      },
    };

    const mainWord = (
      <Text
        text={this.state.currentWord}
        fontSize={50}
        x={500} y={250}
      />
    );

    const synonyms = this.props.gameWords[this.state.currentWord];
    console.log('this.state', this.state)
    return (
      <div>
        <div style={styles.title}>
          <h1>Synonym Matching</h1>
        </div>
        <div>
          <Stage width={1000} height={500}>
            <Layer>
              {mainWord}
              {
                synonyms && synonyms.map((word, index) => {
                  return (
                    <Text
                      key={index}
                      text={word}
                      fontSize={16}
                      x={this.randomNumber(0, 950)} y={this.randomNumber(0, 450)}
                      onClick={this.handleClick}
                    />
                  );
                })
              }
            </Layer>
          </Stage>
        </div>
        <div>
          <Button
            style={styles.button}
            onClick={this.startGame}>
            Start Game
          </Button>
        </div>
        <div>
          <h2>Instructions</h2>
          <p>Do things</p>
          <p>Do things</p>
          <p>Do things</p>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  gameWords: state.words.relatedWords || {},
});

const mapDispatch = dispatch => ({
  dispatchGetRelatedWords: level => dispatch(fetchRandWordAndRelatedWords(level)),
});

export default connect(mapState, mapDispatch)(SynonymGame);
