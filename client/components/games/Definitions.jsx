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
import { NextQuestion, SkipOrSubmit } from './DefinitionsControls';
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
  definitions: {
    // marginTop: "100px",
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
      total: 10,
      lives: 3,
      choice: '',
      response: '',
    };

    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let level = this.props.userLevel < 7 ? 7 : this.props.userLevel + 1;
    this.props.fetchDefinitionsForLevel(level);
  }

  handleChangeOption(e, option){
    this.setState({ choice: option.value });
  }

  handleSubmit(e, form){    
    if(this.state.choice === form["data-word"]) {
      this.setState({response: 'correct'});
    } else{
      this.setState({response: 'incorrect'});
    }
  }

  render() {
    const seed = this.props.match.params.seed;
    const chance = new Chance(seed);

    const { definitions } = this.props;
    let { correct, total } = this.state;
    
    if(Object.keys(definitions).length) {

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
  
      let quiz = [];

      // while(quiz.length < 10) {
      //   let index = chance.natural({ min: 0, max: definitions.length - 1 });
      //   let selected = definitions[index];

      //   let questionIncluded = quiz.filter( question => question.word === selected.word)
        
      //   if(!questionIncluded) {
      //     let newQuestion = createQuestion(selected);
      //     quiz.push(newQuestion);
      //   }
      // }
      console.log( this.state.response )
      
      return (
        <Container className="definitions-container" style={styles.container}>
          <Header as="h2" style={styles.score}>Score: {correct}/{total} </Header>
          <Progress percent={40} size='tiny' color="purple" />
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
            { SkipOrSubmit(this.state.response, this.state.choice) }
            { NextQuestion(this.state.response) }
          </Form>
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
