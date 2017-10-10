import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Message } from 'semantic-ui-react';
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
      speechResult: '',
      userEnded: false,
      prompt: '',
    };
    this.recordingToggle = this.recordingToggle.bind(this);
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
        home.setState({ speechResult });
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
    this.setState({ recognition });
  }

  recordingToggle() {
    if (this.state.recording) {
      this.state.recognition.stop();
      this.setState({
        userEnded: true,
        recording: false,
        speechResult: '',
      });
    } else {
      this.state.recognition.start();
      this.setState({
        recording: true,
      });
    }
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
        cursor: "pointer",
        margin: "auto",
        paddingTop: 70,
        paddingLeft: 90,
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
        paddingTop: 150,
        paddingLeft: 50,
        backgroundColor: "#ffd600",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      innerDiv: {
        width: "50%",
        float: "left",
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
        marginTop: 50,
      },
      instructions: {
        color: "#ffffff",
        weight: 500,
        fontStyle: "italic",
        fontFamily: "Roboto",
      },
      innerCircle: {
        backgroundColor: "#ffffff",
        width: 300,
        height: 300,
        borderRadius: "50%",
        margin: "auto",
        marginTop: 20,
      },
      outerCircle: {
        width: 350,
        height: 350,
        border: "5px solid #ffffff",
        borderRadius: "50%",
        margin: "auto",
      },
      card: {
        backgroundColor: "#ffffff",

        height: 200,
        width: 300,
      },
    };

    const resultsCard = (
      <div style={styles.card}>
        <h2>What I'm hearing...</h2>
        <h3>{this.state.speechResult}</h3>
      </div>
    );

      console.log(this.state);
    return (
      <div style={styles.outerDiv}>
        <div style={styles.innerDiv}>
          <h1 style={styles.instructions}>Speak to me, I'll analyze your speech and help you improve your vocabulary. Click the mic to get started.</h1>
          <Button
            style={styles.button}
            size="large"
            basic
            color="black"
            onClick={this.randomPrompt}>
            What should I say?
          </Button>
          <h3>{this.state.prompt}</h3>
        </div>
        <div style={styles.innerDiv}>
          <div style={styles.outerCircle}>
            <div style={styles.innerCircle}>
              <div style={styles.mic}>
                <img onClick={this.recordingToggle} src="mic.svg"/>
              </div>
            </div>
          </div>
        </div>
        {
          this.state.recording
            ? resultsCard
            : null
        }
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
