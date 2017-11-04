# wordUp

*Up your vocabulary*

Looking to improve your everyday vocabulary? Look no further. Whether you are in school, in the workplace, or merely want to add some eloquence to your dialogue, this tool will analyze your speech and then provide you with quizzes and interactive games to boost your vocabulary level.

## Motivation

While there are many indicators of a broad education, a strong command of language is certainly a major component. There are some existing tools today which can look at your spelling or your grammar, but not too many which can truly improve multiple aspects of your vocabulary. This tool aims to utilize diagnostics to analyze your current level, and then provide both fun and effective exercises to broaden the expanse of your vocabulary. The vocal diagnostic prompts also ensure that improvements are seen not only in your passive vocabulary (comprised of words you understand), but in your active vocabulary as well (words you not only understand, but actively use in your speech).

## Build Status

* **_[DISCUSS TRAVIS-CI WITH GROUP]_**

## Screenshots

* **_[INSERT LOGO]_**
* **_[INSERT SCREENSHOTS]_**

## Tech Used

### Built with

* *[Neo4j, a graph database](https://neo4j.com/)*
* *[D3.js, data visualization tool](https://d3js.org/)*
* *[PostgreSQL, an object-relational database system](https://www.postgresql.org/)*
* *[Node.js, an asynchronous event driven JavaScript runtime environment](https://nodejs.org/en/)*
* *[npm, dependency management](https://www.npmjs.com/)*

## Features

* Vocal speech analysis
* Interactive games
* User level assignment
* Challenging quizzes based on user's level
* Custom, tailored word suggestions for each user
* Complex and interactive data visualizations for each user
* User profile page

## How To Run Locally

To clone and run this application, you'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer.

You'll also need to install following:
* [Neo4j](https://neo4j.com/download/?ref=home)
  * a popular graph database
* [PostgreSQL](https://www.postgresql.org/download/)
  * a traditional object-relational database.
* [Canvas](https://www.npmjs.com/package/canvas)
  * Cairo backed Canvas implementation for NodeJS.

Lastly, you'll need to make accounts for several APIs:
* [twinword](https://www.twinword.com/api/)
  * Natural language processing
* [ROSETTE](https://developer.rosette.com/)
  * Text analysis
* [Google API](https://developers.google.com/identity/sign-in/web/devconsole-project)
  * Not necessary to run application, but only if you would like to test login through a Google username/email account

From your command line:
```
# Clone this repository
$ git clone https://github.com/wordupapp/wordup.git

# Go into the repository
$ cd wordup

# Install dependencies
$ npm install

# Run the application
$ npm run start-dev
```

## API Reference

* **twinword**
  * [Word Dictionary](https://www.twinword.com/api/word-dictionary.php)
  * [Language Scoring](https://www.twinword.com/api/language-scoring.php)
* **ROSETTE**
  * [Morphological Analysis](https://www.rosette.com/capability/morphological-analysis/#overview)
* **Google**
  * [Google OAuth 2.0](https://developers.google.com/identity/protocols/OAuth2)

## Tests

* **_[DESCRIBE TESTS AND SHOW HOW TO RUN THEM WITH CODE EXAMPLES]_**

## How To Use

1. Go to *[wordUp](https://wordup-app.herokuapp.com/)* and make a user account or log in with your Google account
2. Record yourself using a sample prompt or your own imagination to get your first diagnostic baseline and an appropriate vocabulary level
3. Start playing games, completing quizzes, and reviewing the recommended words section to improve your vocabulary!

## Credits

* **_[Janine Garcia](https://github.com/jannncodes)_**
* **_[Jonathan Kammo](https://github.com/jonathankammo)_**
* **_[Jungsun Park](https://github.com/jungsunp)_**
* **_[Robert Shaw](https://github.com/RobertShaw1)_**

## License

* **_[INSERT APPROPRIATE LICENSE ONCE IT HAS BEEN ADDED TO REPO]_**
