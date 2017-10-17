/* eslint-disable react/no-string-refs */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layer, Stage, Text } from 'react-konva';
import { TweenLite, Power3, TimelineMax } from 'gsap';
import random from 'lodash.random';
import sampleSize from 'lodash.samplesize';
import { fetchRandWordAndRelatedWords, removeRelatedWord } from '../../../store/words';
import SynonymInstructions from './SynonymInstructions.js';
import styles from './styles';

class SynonymGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScore: 0,
      gameWords: [],
      currentWord: '',
      level: 7,
      questionNum: 0,
      timer: 15,
      start: false,
      gameEnded: false,
    };
    this.startGame = this.startGame.bind(this);
    this.updateStateAfterClick = this.updateStateAfterClick.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.generateWords = this.generateWords.bind(this);
    this.animateWordAfterClick = this.animateWordAfterClick.bind(this);
    this.drawLayer = this.drawLayer.bind(this);
    this.calculateMainWordPosition = this.calculateMainWordPosition.bind(this);
    this.applyAnimationsToWords = this.applyAnimationsToWords.bind(this);
    this.animationUpdate = this.animationUpdate.bind(this);
    this.animateMainWordifCorrect = this.animateMainWordifCorrect.bind(this);
    this.animateMainWordifIncorrect = this.animateMainWordifIncorrect.bind(this);
    this.animateScoreifIncorrect = this.animateScoreifIncorrect.bind(this);
    this.animateScoreifCorrect = this.animateScoreifCorrect.bind(this);
    this.applyAnimationsToIncorrectWord = this.applyAnimationsToIncorrectWord.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    for (let i = 1; i <= 5; i += 1) {
      this.props.dispatchGetRelatedWords(this.state.level);
    }
  }

  componentDidMount() {
    requestAnimationFrame(this.animationUpdate);
  }

  componentWillUnmount() {
    this.unmounted = false;
    clearInterval(this.timer);
  }

  calculateMainWordPosition() {
    return {
      x: (window.innerWidth / 2) - ((this.state.currentWord.length / 2) * 32),
      y: (window.innerHeight * 0.7) / 2.5,
    };
  }

  startGame() {
    const wordArr = Object.keys(this.props.gameWords);
    this.setState({
      currentWord: wordArr[this.state.questionNum],
    });
    const wordsForLevel = this.generateWords();
    this.setState({
      gameWords: wordsForLevel,
      start: true,
    });
    window.setTimeout(this.applyAnimationsToWords, 0);
    this.timer = setInterval(this.tick, 1000);
  }

  tick() {
    const currentSecond = this.state.timer;
    this.setState({
      timer: currentSecond - 1,
    });
    if (this.state.timer === 0) this.nextQuestion();
  }

  applyAnimationsToWords() {
    this.state.gameWords.forEach(word => {
      const randomDelay = random(0, 4, true);
      const currentWord = this.refs[word.word];
      const tl = new TimelineMax({ repeat: -1 });
      const tl2 = new TimelineMax({ repeat: -1 });
      tl
        .to(currentWord, 14, {
          opacity: 1,
          delay: randomDelay,
        })
        .to(currentWord, 3, {
          opacity: 1,
        })
        .to(currentWord, 14, {
          opacity: 0,
        })
        .to(currentWord, 4, {
          opacity: 0,
        });
      tl2
        .to(currentWord, 35, {
          y: `-=${((window.innerHeight * 0.4) - 50)}`,
          delay: randomDelay,
        });
    });
  }

  applyAnimationsToIncorrectWord(word) {
    const tl = new TimelineMax({ repeat: -1 });
    const tl2 = new TimelineMax({ repeat: -1 });
    tl
      .to(word, 14, {
        opacity: 1,
      })
      .to(word, 3, {
        opacity: 1,
      })
      .to(word, 14, {
        opacity: 0,
      })
      .to(word, 4, {
        opacity: 0,
      });
    tl2
      .to(word, 35, {
        y: `-=${((window.innerHeight * 0.7) - 50)}`,
      });
  }

  generateWords() {
    const gameWords = this.props.gameWords;
    let incorrectWords = [];
    for (const word in gameWords) {
      if (word !== this.state.currentWord) {
        gameWords[word].forEach(word => incorrectWords.push(word));
      }
    }
    incorrectWords = sampleSize(incorrectWords, 10);
    const currentWord = Object.keys(this.props.gameWords)[this.state.questionNum];
    const correctWords = sampleSize(this.props.gameWords[currentWord], 10);
    let wordsToRender = incorrectWords.concat(correctWords);
    wordsToRender = wordsToRender.map(word => {
      return {
        word,

        x: random(50, (window.innerWidth * 0.9) - 50),
        y: random(200, (window.innerHeight * 0.7) - 50),
      };
    });
    return wordsToRender;
  }

  updateStateAfterClick(event) {
    const clickedWord = event.target.attrs.text;
    const currentWordSynonyms = this.props.gameWords[this.state.currentWord];
    let newScore;
    if (currentWordSynonyms.indexOf(clickedWord) === -1) {
      newScore = this.state.currentScore - 1;
      this.applyAnimationsToIncorrectWord(event.target);
      this.animateMainWordifIncorrect();
      this.animateScoreifIncorrect();
    } else {
      newScore = this.state.currentScore + 1;
      if (this.state.gameWords.length === 11) {
        this.nextQuestion();
      } else {
        const updatedWords = this.state.gameWords.filter(wordObj => wordObj.word !== clickedWord);
        this.setState({ gameWords: updatedWords });
        this.animateMainWordifCorrect();
        this.animateScoreifCorrect();
      }
    }
    this.setState({
      currentScore: newScore,
    });
  }

  animateWordAfterClick(event) {
    const wordNode = event.target;
    TweenLite.to(wordNode, 0.8, {
      x: this.calculateMainWordPosition().x + 100,
      y: this.calculateMainWordPosition().y + 40,
      ease: Power3.easeIn,
      onComplete: this.updateStateAfterClick,
      onCompleteParams: [event],
      onUpdate: this.drawLayer,
    });
  }

  animateMainWordifCorrect() {
    const mainWord = this.refs.mainWord;
    const tl = new TimelineMax({ repeat: 2 });
    tl
      .to(mainWord, 0.1, {
        y: '+= 10',
        ease: Power3.easeInOut,
      })
      .to(mainWord, 0.1, {
        y: '-= 10',
        ease: Power3.easeInOut,
      });
  }

  animateScoreifCorrect() {
    const score = this.refs.score;
    const tl = new TimelineMax();
    tl
      .to(score, 0.5, {
        scale: 1.2,
        color: "#65ab00",
      })
      .to(score, 0.5, {
        scale: 1,
        color: "#ffffff",
      });
  }

  animateMainWordifIncorrect() {
    const mainWord = this.refs.mainWord;
    const tl = new TimelineMax({ repeat: 2 });
    tl
      .to(mainWord, 0.1, {
        x: '+= 10',
        ease: Power3.easeInOut,
      })
      .to(mainWord, 0.1, {
        x: '-= 10',
        ease: Power3.easeInOut,
      });
  }

  animateScoreifIncorrect() {
    const score = this.refs.score;
    const tl = new TimelineMax();
    tl
      .to(score, 0.5, {
        scale: 1.2,
        color: "#e70800",
      })
      .to(score, 0.5, {
        scale: 1,
        color: "#ffffff",
      });
  }

  drawLayer() {
    if (this.refs.layer) {
      this.refs.layer.draw();
    }
  }

  animationUpdate() {
    this.drawLayer();
    if (this.unmounted !== true) {
      requestAnimationFrame(this.animationUpdate);
    }
  }

  nextQuestion() {
    const wordArr = Object.keys(this.props.gameWords);
    const newQuestNum = this.state.questionNum + 1;
    if (wordArr.length === newQuestNum) {
      this.setState({
        gameEnded: true,
        currentWord: '',
      });
      clearInterval(this.timer);
    } else {
      this.setState({
        questionNum: newQuestNum,
        currentWord: wordArr[newQuestNum],
        timer: 15,
      });
      const wordsForLevel = this.generateWords();
      this.setState({
        gameWords: wordsForLevel,
      }, this.applyAnimationsToWords);
    }
  }

  render() {
    

    // const mainWord = (
    //   <Text
    //     ref="mainWord"
    //     text={this.state.currentWord}
    //     fontFamily="Fredoka One"
    //     fontSize={62}
    //     fill="#ffffff"
    //     x={this.calculateMainWordPosition().x}
    //     y={this.calculateMainWordPosition().y}
    //   />
    // );

    const startButton = (
      <div style={styles.button} onClick={this.startGame}>Start</div>
    );

    const timer = (
      <h3 style={styles.timer}>
        {
          this.state.timer < 10
            ? `0:0${this.state.timer}`
            : `0:${this.state.timer}`
        }
      </h3>
    );

    const gameOver = (
      <div style={styles.gameOver}>Game Over!</div>
    );

    const words = this.state.gameWords;
    return (
      <div style={styles.div}>
        <div style={styles.titleContainer}>
          <div style={styles.scores}>
            <h3 ref="score" style={styles.h3}>Your Score: {this.state.currentScore}</h3>
          </div>
          <div>
            {
              this.state.start || this.state.gameEnded
                ? timer
                : startButton
            }
          </div>
          <div style={styles.scores}>
            <h3 style={styles.h3}>Your High Score: {this.props.highScore}</h3>
          </div>
        </div>
        <div>
          {
            this.state.start
              ? null
              : SynonymInstructions()
          }
          {
            this.state.gameEnded
              ? gameOver
              :
              <Stage ref="stage" width={window.innerWidth} height={window.innerHeight * 0.7}>
                <Layer ref="layer">
                  <Text
                    ref="mainWord"
                    text={this.state.currentWord}
                    fontFamily="Fredoka One"
                    fontSize={62}
                    fill="#ffffff"
                    x={this.calculateMainWordPosition().x}
                    y={this.calculateMainWordPosition().y}
                  />
                  {
                    words && words.map((word, index) => {
                      return (
                        <Text
                          ref={word.word}
                          key={word.word}
                          text={word.word}
                          fontFamily="Roboto"
                          opacity={0}
                          fontSize={26}
                          fontStyle="bold"
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
            }
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  gameWords: state.words.relatedWords || {},
  highScore: 98,
  start: new Date(),
});

const mapDispatch = dispatch => ({
  dispatchGetRelatedWords: level => dispatch(fetchRandWordAndRelatedWords(level)),
  dispatchRemoveRelatedWord: (currentWord, wordToRemove) =>
    dispatch(removeRelatedWord(currentWord, wordToRemove)),
});

export default connect(mapState, mapDispatch)(SynonymGame);
