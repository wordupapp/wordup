import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Layer, Stage, Text } from 'react-konva';
import { TweenLite, Power3, TimelineMax } from 'gsap';
import _ from 'lodash';
import { fetchRandWordAndRelatedWords, removeRelatedWord } from '../store/words';

class SynonymGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScore: 0,
      gameWords: [],
      currentWord: '',
      level: 7,
      questionNum: 0,
    };
    this.startGame = this.startGame.bind(this);
    this.updateStateAfterClick = this.updateStateAfterClick.bind(this);
    this.randomPosition = this.randomPosition.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.generateWords = this.generateWords.bind(this);
    this.animateWordAfterClick = this.animateWordAfterClick.bind(this);
    this.drawLayer = this.drawLayer.bind(this);
    this.calculateMainWordPosition = this.calculateMainWordPosition.bind(this);
    this.applyAnimationsToWords = this.applyAnimationsToWords.bind(this);
    this.animationUpdate = this.animationUpdate.bind(this);
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
      currentWord: wordArr[this.state.questionNum],
    });
    const wordsForLevel = this.generateWords();
    this.setState({
      gameWords: wordsForLevel,
    });
    window.setTimeout(this.applyAnimationsToWords, 100);
  }

  applyAnimationsToWords() {
    this.state.gameWords.forEach(word => {
      const randomDelay = _.random(0, 10, true);
      const randomDelayMove = _.random(0, 5, true);
      const currentWord = this.refs[word.word];
      const tl = new TimelineMax({ repeat: -1 });
      const tl2 = new TimelineMax({ repeat: -1 });
      tl
        .to(currentWord, 5, {
          opacity: 1,
          delay: randomDelay,
        })
        .to(currentWord, 3, {
          opacity: 1,
        })
        .to(currentWord, 5, {
          opacity: 0,
        })
        .to(currentWord, 5, {
          opacity: 0,
        });
        tl2
        .to(currentWord, 3, {
          x: '+= 50',
          delay: randomDelayMove,
          ease: Power3.easeInOut,
        })
        .to(currentWord, 3, {
          x: '-=50',
          ease: Power3.easeInOut,
        });
    });
  }

  generateWords() {
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
        x: this.randomPosition(50, (window.innerWidth * 0.9) - 50),
        y: this.randomPosition(50, (window.innerHeight * 0.7) - 50),
      };
    });
    return renderWords;
  }

  animateWordAfterClick(event) {
    const wordNode = event.target;
    TweenLite.to(wordNode, 0.6, {
      x: this.calculateMainWordPosition().x + 100,
      y: this.calculateMainWordPosition().y + 40,
      ease: Power3.easeIn,
      onComplete: this.updateStateAfterClick,
      onCompleteParams: [event],
      onUpdate: this.drawLayer,
    });
  }

  drawLayer() {
    this.refs.layer.draw();
  }

  animationUpdate () {
    this.drawLayer();
    requestAnimationFrame(this.animationUpdate);
  }

  updateStateAfterClick(event) {
    const clickedWord = event.target.attrs.text;
    const currentWordSynonyms = this.props.gameWords[this.state.currentWord];
    let newScore;
    if (currentWordSynonyms.indexOf(clickedWord) === -1) {
      newScore = this.state.currentScore - 1;
    } else {
      newScore = this.state.currentScore + 1;
      if (this.state.gameWords.length === 11) {
        this.nextQuestion();
      } else {
        const updatedWords = this.state.gameWords.filter(wordObj => wordObj.word !== clickedWord);
        this.setState({ gameWords: updatedWords });
      }
    }
    this.setState({
      currentScore: newScore,
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

  calculateMainWordPosition() {
    return {
      x: (window.innerWidth / 2) - ((this.state.currentWord.length / 2) * 32),
      y: (window.innerHeight * 0.7) / 2.5,
    };
  }

  render() {
    const styles = {
      title: {
        paddingTop: 50,
      },
      titleFont: {
        fontFamily: "Fredoka One",
        fontSize: 68,
      },
      titleContainer: {
        display: "flex",
        justifyContent: "space-evenly",
      },
      button: {
        backgroundColor: "#0a00b6",
        color: "#ffffff",
        margin: "auto",
      },
      div: {
        backgroundColor: "#ffd600",
        textAlign: "center",
      },

    };

    const mainWord = (
      <Text
        text={this.state.currentWord}
        fontFamily="Fredoka One"
        fontSize={50}
        x={this.calculateMainWordPosition().x}
        y={this.calculateMainWordPosition().y}
      />
    );

    const words = this.state.gameWords;
    console.log('this.state', this.state)
    requestAnimationFrame(this.animationUpdate);
    return (
      <div style={styles.div}>
        <div style={styles.title}>
          <h1 style={styles.titleFont}>Synonym Matching</h1>
          <div style={styles.titleContainer}>
            <div><h3>Your Score: {this.state.currentScore}</h3></div>
            <div>
              <Button
                style={styles.button}
                onClick={this.startGame}>
                Start New Game
              </Button>
            </div>
            <div><h3>Your High Score: {this.props.highScore}</h3></div>
          </div>
        </div>
        <div>
          <Stage ref="stage" width={window.innerWidth} height={window.innerHeight * 0.7}>
            <Layer ref="layer">
              {mainWord}
              {
                words && words.map((word, index) => {
                  return (
                    <Text
                      ref={word.word}
                      key={index}
                      text={word.word}
                      fontFamily="Roboto"
                      opacity={0}
                      fontSize={16}
                      x={word.x} y={word.y}
                      onClick={this.animateWordAfterClick}
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
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  gameWords: state.words.relatedWords || {},
  highScore: 98,
});

const mapDispatch = dispatch => ({
  dispatchGetRelatedWords: level => dispatch(fetchRandWordAndRelatedWords(level)),
  dispatchRemoveRelatedWord: (currentWord, wordToRemove) =>
    dispatch(removeRelatedWord(currentWord, wordToRemove)),
});

export default connect(mapState, mapDispatch)(SynonymGame);
