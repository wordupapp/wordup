import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Message } from 'semantic-ui-react';
import { sendWords } from '../store/userWords';
import { TweenLite, Power1, TimelineMax } from 'gsap';

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
      interimResults: '',
      showCard: false,
    };
    this.recordingToggle = this.recordingToggle.bind(this);
    this.randomPrompt = this.randomPrompt.bind(this);
    this.animationToggle = this.animationToggle.bind(this);
    this.tl = new TimelineMax({ repeat: -1 });
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
      let resultsToPrint = home.state.interimResults.concat(speechResult);
      console.log('all results', resultsToPrint.length)
      if (resultsToPrint.length > 250) {
        const beginCutIndex = resultsToPrint.length - 250;
        console.log('begincutindex', beginCutIndex);
        resultsToPrint = resultsToPrint.slice(beginCutIndex);
      }
      home.setState({
        interimResults: resultsToPrint,
      });
      console.log('interimResults', home.state.interimResults.length)
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
      this.animationToggle(false);
      this.state.recognition.stop();
      this.setState({
        userEnded: true,
        recording: false,
        speechResult: '',
      });
    } else {
      this.state.recognition.start();
      this.animationToggle(true);
      this.setState({
        recording: true,
        showCard: true,
        interimResults: '',
      });
    }
  }

  randomPrompt() {
    const randomIndex = Math.floor(Math.random() * this.props.prompts.length);
    this.setState({
      prompt: this.props.prompts[randomIndex],
    });
  }

  animationToggle(playAnimation) {
    const circle = this.refs.outerCircle;
    if (playAnimation) {
      this.tl
        .to(circle, 0.2, {
          scale: 1.12,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.2, {
          scale: 0.9,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.13, {
          scale: 1.15,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.19, {
          scale: 1,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.15, {
          scale: 1.13,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.2, {
          scale: 0.95,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.2, {
          scale: 1.14,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.2, {
          scale: 1.1,
          ease: Power1.easeInOut,
        })
        .to(circle, 0.2, {
          scale: 1,
          ease: Power1.easeInOut,
        });
    } else {
      this.tl.restart();
      this.tl.kill();
    }
  }

  render() {
    const styles = {
      mic: {
        margin: "auto",
        position: "absolute",
        top: 100,
        left: 270,
        cursor: "pointer",
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
        width: "45%",
        float: "left",
        position: "relative",
      },
      promptContainer: {
        marginTop: "4em",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      },
      prompt: {
        marginLeft: 50,
      },
      button: {
        marginTop: 50,
        marginLeft: 50,
      },
      instructions: {
        color: "#ffffff",
        weight: 500,
        fontStyle: "italic",
        fontFamily: "Roboto",
        marginTop: 40,
        marginLeft: 50,
        marginRight: 50,
      },
      innerCircle: {
        backgroundColor: "#ffffff",
        width: 300,
        height: 300,
        borderRadius: "50%",
        position: "absolute",
        top: 25,
        left: 175,
        cursor: "pointer",
      },
      outerCircle: {
        width: 350,
        height: 350,
        border: "5px solid #ffffff",
        borderRadius: "50%",
        userSelect: "none",
        position: "absolute",
        top: 0,
        left: 150,
      },
      card: {
        backgroundColor: "#ffffff",
        height: 250,
        width: 400,
        position: "absolute",
        top: 250,
        left: 125,
        borderRadius: 10,
        padding: 20,
        textAlign: "center",
      },
    };

    const resultsCard = (
      <div style={styles.card}>
        <h2>
          {
            this.state.recording
              ? "Some of what I'm hearing..."
              : "Some of what I heard..."
          }
        </h2>
        <h3>{this.state.interimResults}</h3>
      </div>
    );

    return (
      <div style={styles.outerDiv}>
        <div style={styles.innerDiv}>
          <h1 style={styles.instructions}>Speak to me, I'll analyze your speech and help you improve your vocabulary. Click the mic to get started.</h1>
          <Button
            style={styles.button}
            size="huge"
            basic
            color="black"
            onClick={this.randomPrompt}>
            What should I say?
          </Button>
          <h3 style={styles.prompt}>{this.state.prompt}</h3>
        </div>
        <div style={styles.innerDiv}>
          <div style={styles.outerCircle} ref="outerCircle" />
          <div style={styles.innerCircle} onClick={this.recordingToggle} />
          <img style={styles.mic} src="mic.svg" onClick={this.recordingToggle} />
          {
            this.state.interimResults
              ? resultsCard
              : null
          }
        </div>
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
