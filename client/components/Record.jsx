import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';


const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

class Record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognition: {},
      recording: false,
      results: [],
      userEnded: false,
      prompt: '',
    };
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.randomPrompt = this.randomPrompt.bind(this);
  }

  componentWillMount() {
    const grammar = '#JSGF V1.0; grammar phrase;';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const home = this;
    recognition.onresult = function (event) {
      const speechResult = event.results[event.resultIndex][0].transcript;
      const confidence = event.results[event.resultIndex][0].confidence;
      const newResult = [speechResult, confidence];
      home.setState({
        results: [...home.state.results, [newResult]],
      });
    };

    recognition.onerror = function (event) {
      this.setState({
        recording: false,
      });
      console.log('Error occured: ', event.error);
    };

    this.setState({
      recognition,
    });
  }

  startRecording() {
    this.state.recognition.start();
    this.setState({
      recording: true,
    });
  }

  stopRecording() {
    this.state.recognition.stop();
    this.setState({
      userEnded: true,
      recording: false,
    });
  }

  randomPrompt() {
    const randomIndex = Math.floor(Math.random() * this.props.prompts.length);
    this.setState({
      prompt: this.props.prompts[randomIndex],
    });
  }

  render() {
    const styles = {
      mic: {
        width: 200,
        height: 200,
      },
      iconOn: {
        width: 200,
        height: 200,
        color: "#0a00b6",
      },
      iconOff: {
        width: 200,
        height: 200,
        color: "#d50000",
      },
      flex: {
        width: "100%",
        height: "100%",
      },
      button: {
        backgroundColor: "#0a00b6",
        color: "#ffffff",
      },
    };

    const startRecordingButton = (
      <Icon.Group
        size="huge"
        onClick={this.startRecording}
        style={styles.mic}>
        <Icon size="big" name="thin circle" style={styles.iconOn} />
        <Icon name="microphone" style={styles.iconOn} />
      </Icon.Group>
    );

    const stopRecordingButton = (
      <Icon.Group
        size="huge"
        onClick={this.stopRecording}
        style={styles.mic}>
        <Icon size="big" name="thin circle" style={styles.iconOff} />
        <Icon name="microphone" style={styles.iconOff} />
      </Icon.Group>
    );

    return (
      <div style={styles.flex}>
        <div>
          <h2>Hi, user!</h2>
        </div>
        {
          !this.state.recording
            ? startRecordingButton
            : stopRecordingButton
        }
        <div>
          <h3>Need some prompts?</h3>
          <Button
            onClick={this.randomPrompt}
            style={styles.button}>
            New prompt
          </Button>
          <p>{this.state.prompt}</p>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  prompts: [
    "If you were a city, which city would you choose to be and why?",
    "Share a description of your favorite material object that you already own",
    "Share a best-loved childhood memory",
    "Who is the most inspirational person to you?",
  ],
});

// const mapDispatch = dispatch => ({

// });

const mapDispatch = null;


export default connect(mapState, mapDispatch)(Record);
