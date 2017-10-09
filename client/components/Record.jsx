import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';
import { sendWords } from '../store/userWords';


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

  componentDidMount() {
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
      const { dispatchSendWords, user } = home.props;
      const speechResult = event.results[event.resultIndex][0].transcript;
      const confidence = event.results[event.resultIndex][0].confidence;
      if (confidence > 0.5) {
        // const newResult = [speechResult, confidence];
        // const newWords = home.getFormattedWords(newResult);
        console.log('speechResult: ', speechResult);
        dispatchSendWords(speechResult, user.id);
      }
    };

    recognition.onerror = function (event) {
      this.setState({
        recording: false,
      });
      console.log('Error occured: ', event.error);
    };
    recognition.onerror = recognition.onerror.bind(home);

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

  // getFormattedWords(result) {
  //   const formattedWords = new Set();
  //   if (result[1] > 0.5) {
  //     const tempArr = result[0].split(' ');
  //     const pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  //     tempArr.forEach(word => {
  //       if (pattern.test(word)) return; // don't process words with special characters
  //       if (word) formattedWords.add(word.toLowerCase());
  //     });
  //   }
  //   return [...formattedWords];
  // }

  randomPrompt() {
    const randomIndex = Math.floor(Math.random() * this.props.prompts.length);
    this.setState({
      prompt: this.props.prompts[randomIndex],
    });
  }

  render() {
    const styles = {
      mic: {
        cursor: "pointer",
      },
      iconOn: {
        width: 200,
        color: "#0a00b6",
        margin: "auto",
      },
      iconOff: {
        width: 200,
        color: "#d50000",
        margin: "auto",
      },
      outerDiv: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      promptContainer: {
        marginTop: "4em",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      },
      prompt: {
        marginTop: "2em",
      },
      button: {
        backgroundColor: "#0a00b6",
        color: "#ffffff",
        margin: "auto",
      },
    };

    const startRecordingButton = (
      <div
        onClick={this.startRecording}
        style={styles.mic}>
        <Icon name="microphone" size="massive"style={styles.iconOn} />
      </div>
    );

    const stopRecordingButton = (
      <div
        onClick={this.stopRecording}
        style={styles.mic}>
        <Icon name="microphone" size="massive"style={styles.iconOff} />
      </div>
    );

    return (
      <div style={styles.outerDiv}>
        {
          !this.state.recording
            ? startRecordingButton
            : stopRecordingButton
        }
        <div style={styles.promptContainer}>
          <h3>Need a prompt?</h3>
          <Button
            onClick={this.randomPrompt}
            style={styles.button}>
            New prompt
          </Button>
        </div>
        <p style={styles.prompt}>{this.state.prompt}</p>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  user: state.user,
  prompts: [
    "If you were a city, which city would you choose to be and why?",
    "Share a description of your favorite material object that you already own",
    "Share a best-loved childhood memory",
    "Who is the most inspirational person to you?",
  ],
});

const mapDispatch = dispatch => ({
  dispatchSendWords: (speech, userId) => dispatch(sendWords(speech, userId)),
});

export default connect(mapState, mapDispatch)(Record);
