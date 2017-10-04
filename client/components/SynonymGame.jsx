import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Layer, Rect, Stage, Group, Text } from 'react-konva';

class SynonymGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userScore: 0,
      opponentScore: 0,
      currentWord: 'Test',
      correctSynonyms: ['Correct'],
    };
    // this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const clickedWord = event.target.attrs.text;
    let newScore;
    if (this.state.correctSynonyms.indexOf(clickedWord) === -1) {
      newScore = this.state.userScore - 1;
    } else {
      newScore = this.state.userScore + 1;
    }
    this.setState({
      userScore: newScore,
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
        text="Test"
        fontSize={16}
        x={10} y={10} width={100} height={100}
      />
    );

    const synonym = (
      <Text
        text="Correct"
        fontSize={16}
        x={100} y={100} width={100} height={100}
        onClick={this.handleClick}
      />
    );

    const antonym = (
      <Text
        text="Incorrect"
        fontSize={16}
        x={200} y={100} width={100} height={100}
        onClick={this.handleClick}
      />
    );

    console.log(this.state)
    return (
      <div>
        <div style={styles.title}>
          <h1>Synonym Matching</h1>
        </div>
        <div>
          <Stage width={500} height={500}>
            <Layer>
              {mainWord}
              {synonym}
              {antonym}
            </Layer>
          </Stage>
        </div>
        <div>
          <Button
            style={styles.button}>
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


const mapState = null;
const mapDispatch = null;
// const mapState = (state, ownProps) => ({

// });

// const mapDispatch = dispatch => ({
//   // dispatchSendWords: (newWords, userId) => dispatch(sendWords(newWords, userId)),
// });

export default connect(mapState, mapDispatch)(SynonymGame);
