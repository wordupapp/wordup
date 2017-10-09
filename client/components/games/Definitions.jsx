/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable */

// NODE MODULES
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chance from 'chance';
import { Checkbox, Container, Dimmer, Form, Header, Loader, Progress } from 'semantic-ui-react';

// LOCAL MODULES
import { NextQuestion, Skip, Submit } from './DefinitionsControls';
import { fetchDefinitionsForLevelThunk } from '../../store/words';


/**
 * STYLES
 */
const styles = {
  container: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    width: "37em",
  },
  navContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0em 3em",
    marginTop: "80px",
  },
  nav: {
    margin: "0",
  },
  score: {
    marginTop: "4em",
  }
}


/**
 * COMPONENT
 */
class Definitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correct: 0,
      total: 0,
      choice: '',
      response: '',
      quiz: [],
      submissions: [],
    };

    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSkipOrNext = this.handleSkipOrNext.bind(this);
  }

  componentDidMount() {
    let level = this.props.userLevel < 7 ? 7 : this.props.userLevel + 1;
    this.props.fetchDefinitionsForLevel(level);
  }

  componentWillReceiveProps(nextProps) {
    let seed = this.props.match.params.seed;

    if(!this.state.quiz.length) this.setState({quiz: [+seed]});
  }

  handleChangeOption(e, option){
    this.setState({ choice: option.value });
  }

  handleSubmit(e, form){
    const { definitions } = this.props;
    const { choice, quiz, submissions } = this.state;

    let currentQuiz;
    if(quiz.length) currentQuiz = quiz[quiz.length - 1];
    const updatedSubmissions = submissions.concat([currentQuiz]);

    let updatedCorrect = this.state.correct + 1;
    let updatedTotal = this.state.total + 1;

    if(choice === form["data-word"]) {
      this.setState({correct: updatedCorrect, response: 'correct', submissions: updatedSubmissions, total: updatedTotal});
    } else{
      this.setState({response: 'incorrect', submissions: updatedSubmissions, total: updatedTotal});
    }
  }

  handleSkipOrNext() {
    const { definitions } = this.props;    
    const { quiz } = this.state;
    let currentQuiz;
    if(quiz.length) currentQuiz = quiz[quiz.length - 1];

    const chance = new Chance(currentQuiz);
    let nextQuiz = chance.natural({ min: 0, max: definitions.length - 1 });

    while(quiz.indexOf(nextQuiz) > -1) {
      nextQuiz = chance.natural({ min: 0, max: definitions.length - 1 });
    }

    let newQuiz = [...quiz, nextQuiz];
    this.setState({choice: '', response: '', quiz: newQuiz});    
  }

  render() {
    const { definitions } = this.props;
    const quizIndex = this.state.quiz.length - 1;
    const seed = this.state.quiz[quizIndex];
    
    if(definitions.length) {
      let chance = new Chance(seed)

      let { correct, total } = this.state;

      let index = chance.natural({ min: 0, max: definitions.length - 1 });
      let selected = definitions[index];
        
      let options = [];    
      while(options.length < 4) {
        let index = chance.natural({ min: 0, max: definitions.length - 1 });      
        let newOption = definitions[index].word;
          
        if(options.indexOf(newOption) === -1  && newOption !== selected.word) {
          options.push(newOption);
        }
      }
    
      /** Now we place the correct word in a random index in our options array **/ 
      let randomIndex = chance.natural({ min: 0, max: options.length - 1 });
      options[randomIndex] = selected.word;
      
      return (
        <Container className="definitions-container" style={styles.container}>
          <Header as="h2" style={styles.score}>Score: {correct}/{total} </Header>
          <Progress percent={this.state.total/.1} size='tiny' color="purple" />
          <Header as="h1">Match the correct word to the definition:</Header>
          <Header as="h3">Definition: {selected.meaning}</Header>
          <Form style={styles.form} data-word={selected.word} onSubmit={this.handleSubmit}>
            {
              options.map( (option, index) => {
                return (
                  <Form.Field key={index}>
                    <Checkbox
                      radio
                      label={option}
                      name="checkboxRadioGroup"
                      value={option}
                      checked={ this.state.choice === option }
                      onChange={ this.handleChangeOption }
                    />
                  </Form.Field>
                )
              })
            }
            <div style={styles.navContainer}>
              <Skip response={this.state.response} next={this.handleSkipOrNext} />
              <Submit response={this.state.response} choice={this.state.choice} />
            </div>
          </Form>
          <NextQuestion response={this.state.response} next={this.handleSkipOrNext} />
        </Container>
      );
    } else {
      return(
        <Dimmer active>
          <Loader size='massive'>Loading</Loader>
        </Dimmer>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    userLevel: state.userLevel,
    definitions: state.words.definitions,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDefinitionsForLevel(userLevel) {
      dispatch(fetchDefinitionsForLevelThunk(userLevel));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Definitions);
