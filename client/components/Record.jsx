import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react'

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
    };
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
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

  render() {
    console.log('here')
    // const styles = {

    // }

    const startRecordingButton = (
      <Icon.Group
        size="huge"
        color="#0a00b6"
        onClick={this.startRecording}>
        <Icon size="big" name="thin-circle" />
        <Icon name="microphone" />
      </Icon.Group>
    );

    const stopRecordingButton = (
      <Icon.Group
        size="huge"
        onClick={this.stopRecording}>
        <Icon size="big" name="thin-circle" />
        <Icon name="microphone-slash" />
      </Icon.Group>
    );

    return (
      <div>
        {
          !this.state.recording
            ? startRecordingButton
            : stopRecordingButton
        }
      </div>
    );
  }
}

// const mapState = (state, ownProps) => ({

// });

// const mapDispatch = dispatch => ({

// });

const mapState = null;

const mapDispatch = null;


export default connect(mapState, mapDispatch)(Record);
