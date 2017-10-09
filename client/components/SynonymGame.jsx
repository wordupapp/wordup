import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Layer, Stage, Text } from 'react-konva';
import _ from 'lodash';
import { fetchRandWordAndRelatedWords, removeRelatedWord } from '../store/words';

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
    this.randomPosition = this.randomPosition.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.generateWords = this.generateWords.bind(this);
  }

  componentWillMount() {
    for (let i = 0; i <= 5; i += 1) {
      this.props.dispatchGetRelatedWords(this.state.level);
    }
  }

  randomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  startGame() {
    const wordArr = Object.keys(this.props.gameWords);
    this.setState({
      gameWords: wordArr,
      currentWord: wordArr[this.state.questionNum],
    });
    const wordsForLevel = this.generateWords();
    this.setState({
      gameWords: wordsForLevel,
    });
  }

  generateWords () {
    const gameWords = this.props.gameWords;
    let renderWords = [];
    for (let word in gameWords) {
      if (word !== this.state.currentWord) {
        gameWords[word].forEach(word => renderWords.push(word));
      }
    }
    renderWords = _.sampleSize(renderWords, 10);
    const currentWord = Object.keys(this.props.gameWords)[this.state.questionNum];
    renderWords = renderWords.concat(this.props.gameWords[currentWord]);
    renderWords = renderWords.map(word => {
      return {
        word,
        x: this.randomPosition(50, 900),
        y: this.randomPosition(50, 450),
      };
    });
    return renderWords;
  }

  renderWordsForLevel(words) {
    this.setState({
      gameWords: words,
    });
  }

  handleClick(event) {
    const clickedWord = event.target.attrs.text;
    const currentWordSynonyms = this.props.gameWords[this.state.currentWord];
    let newScore;
    if (currentWordSynonyms.indexOf(clickedWord) === -1) {
      newScore = this.state.userScore - 1;
    } else {
      newScore = this.state.userScore + 1;
      if (this.state.gameWords.length === 11) {
        this.nextQuestion();
      } else {
        const updatedWords = this.state.gameWords.filter(wordObj => wordObj.word !== clickedWord);
        this.setState({ gameWords: updatedWords });
      }
    }
    this.setState({
      userScore: newScore,
    });
  }

  nextQuestion() {
    const wordArr = Object.keys(this.props.gameWords);
    const newQuestNum = this.state.questionNum + 1;
    this.setState({
      questionNum: newQuestNum,
      currentWord: wordArr[newQuestNum],
    });
    const wordsForLevel = this.generateWords();
    this.setState({
      gameWords: wordsForLevel,
    });
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
        x={500} y={200}
      />
    );

    const words = this.state.gameWords;
    console.log('this.state', this.state)
    return (
      <div>
        <div style={styles.title}>
          <h1>Synonym Matching</h1>
          <h3>Your Score: {this.state.userScore}</h3>
          <h3>Opponent Score: {this.state.opponentScore}</h3>
        </div>
        <div>
          <Stage ref="stage" width={1000} height={500}>
            <Layer>
              {mainWord}
              {
                words && words.map((word, index) => {
                  return (
                    <Text
                      key={index}
                      text={word.word}
                      fontSize={16}
                      x={word.x} y={word.y}
                      onClick={this.handleClick}
                      onMouseEnter={() => {
                        const stage = this.refs.stage.getStage().container();
                        stage.style.cursor = "pointer";
                      }}
                      onMouseLeave={() => {
                        const stage = this.refs.stage.getStage().container();
                        stage.style.cursor = "default";
                      }}
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
  dispatchRemoveRelatedWord: (currentWord, wordToRemove) =>
    dispatch(removeRelatedWord(currentWord, wordToRemove)),
});

export default connect(mapState, mapDispatch)(SynonymGame);
