const readline = require('readline-sync');

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  score: {human: 0, computer: 0},
  rounds: 5,
  winners: {
    rock:     ['paper',    'spock'],
    paper:    ['scissors', 'lizard'],
    scissors: ['rock',     'spock'],
    lizard:   ['scissors', 'rock'],
    spock:    ['lizard',   'paper'],
  },
  losers: {
    rock:     ['scissors', 'lizard'],
    paper:    ['rock',     'spock'],
    scissors: ['paper',    'lizard'],
    lizard:   ['paper',    'spock'],
    spock:    ['rock',     'scissors'],
  },
  validInput: {
    rock: ['ro', 'roc', 'rock'],
    paper: ['pa', 'pap', 'paper'],
    scissors: ['sc', 'sci', 'scissors'],
    lizard: ['li', 'liz', 'lizard'],
    spock: ['sp', 'spo', 'spock'],
  },

  displayWelcomeMessage() {
    console.clear();
    console.log('Welome to Rock, Paper, Scissors, Lizard, Spock!');
    console.log(`Win ${this.rounds} rounds to win the game.`);
  },

  displayGoodbyeMessage() {
    console.clear();
    console.log('Thank you for playing Rock, Paper, Scissors!');
  },

  updateAndDisplayScore() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    console.log(`You chose ${humanMove} and the computer chose ${computerMove}.`);
    if (this.playerWins(humanMove, computerMove)) {
      this.score.human += 1;
      console.log(`You won the round.\nSCORE - Human: ${this.score.human}, Computer: ${this.score.computer}.`);
    } else if (humanMove === computerMove) {
      console.log(`It's a tie. The score is: Human: ${this.score.human}, Computer: ${this.score.computer}.`);
    } else {
      this.score.computer += 1;
      console.log(`The computer won the round.\nSCORE - Human: ${this.score.human}, Computer: ${this.score.computer}.`);
    }
  },

  displayMoves(player) {
    let movesArray = [];
    let moveString;

    for (const [key, value] of Object.entries(this[player].moves)) {
      movesArray.push(`${key}: ${value}`);
    }

    if (player === 'human') {
      moveString = '\nHuman Moves ------ ';
    } else {
      moveString = 'Computer Moves --- ';
    }

    if (movesArray.length === 1) {
      moveString += movesArray[0];
    } else {
      moveString += movesArray.join(', ');
    }
    console.log(moveString);
  },

  displayMatchWinner() {
    if (this.score.human === this.rounds) {
      console.log('\nYou win the match!!!');
    } else {
      console.log('\nThe computer wins the Match!!!');
    }
  },

  playAgain() {
    console.log('\nWould you like to play again? (yes/no)');
    let answer = readline.question().toLowerCase();

    let validAnswers = ['y', 'yes', 'yep', 'yeah', 'yay',
      'n', 'no', 'nope', 'nah', 'nay'];
    let isValid = validAnswers.includes(answer);
    while (!isValid) {
      console.log('Sorry, that is invalid. Please enter yes or no.');
      answer = readline.question();
      isValid = validAnswers.includes(answer);
    }

    return ['y', 'yes', 'yep', 'yeah', 'yay'].includes(answer);
  },

  updateHumanMovePercentage() {
    let roMoves = this.human.moves.rock;
    let paMoves = this.human.moves.paper;
    let scMoves = this.human.moves.scissors;
    let liMoves = this.human.moves.lizard;
    let spMoves = this.human.moves.spock;
    let totalMoves = roMoves + paMoves + scMoves + liMoves + spMoves;
    this.human.movePercentage.rock = (roMoves / totalMoves) * 100;
    this.human.movePercentage.paper = (paMoves / totalMoves) * 100;
    this.human.movePercentage.scissors = (scMoves / totalMoves) * 100;
    this.human.movePercentage.lizard = (liMoves / totalMoves) * 100;
    this.human.movePercentage.spock = (spMoves / totalMoves) * 100;
  },

  playerWins(choice, computerChoice) {
    return this.losers[choice].includes(computerChoice);
  },

  newMatch() {
    console.clear();
    console.log('New Match!');
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.score = {human: 0, computer: 0};
      while (this.score.human < this.rounds &&
             this.score.computer < this.rounds) {
        this.human.choose(this.validInput);
        this.computer.choose(this.human.movePercentage, this.winners);
        console.clear();
        this.updateAndDisplayScore();
        this.displayMoves('human');
        this.displayMoves('computer');
        this.updateHumanMovePercentage();
      }
      this.displayMatchWinner();
      if (!this.playAgain()) break;
      this.newMatch();
    }
    this.displayGoodbyeMessage();
  }
};

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose(humanMovePercentages, winnerObj) {
      //Rule: Use the percentages of the human player's moves to represent
      //the likelihood that the computer will choose the move which beats
      //that move. For example, if the human chooses rock 80% of the time,
      //then the computer will have an 80% chance of choosing paper.
      //Represent each likelihood as a unique range between 1 and 100
      //and then choose a random number from 1 to 100 to select the choice.
      let weights = createWeights(humanMovePercentages);
      let random1 = Math.ceil(Math.random() * 100);
      let random2 = Math.floor(Math.random() * 2);
      if (random1 <= weights.rock) {
        //this.move beats rock
        this.move = winnerObj.rock[random2];
      } else if (random1 > weights.rock && random1 <= weights.paper) {
        //this.move beats paper
        this.move = winnerObj.paper[random2];
      } else if (random1 > weights.paper && random1 <= weights.scissors) {
        //this.move beats scissors
        this.move = winnerObj.scissors[random2];
      } else if (random1 > weights.scissors && random1 <= weights.lizard) {
        //this.move beats lizard
        this.move = winnerObj.lizard[random2];
      } else {
        //this.move beats spock
        this.move = winnerObj.spock[random2];
      }
      this.moves[this.move] += 1;
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    movePercentage: {rock: 20, paper: 20, scissors: 20, lizard: 20, spock: 20},

    choose(validInput) {
      let input;
      let choice = null;
      while (!choice) {
        input = readline.question('\nPlease choose rock, paper, scissors, ' +
        'lizard, or spock (ro/pa/sc/li/sp).\n').toLowerCase();
        let validInputKeys = Object.keys(validInput);
        for (let key = 0; key < validInputKeys.length; key++) {
          let current = validInputKeys[key];
          if (validInput[current].includes(input)) {
            choice = current;
          }
        }
        console.log('Sorry, invalid choice. Try again.');
      }
      this.move = choice;
      this.moves[choice] += 1;
    }
  };
  return Object.assign(playerObject, humanObject);
}

function createPlayer() {
  return {
    move: null,
    moves: {rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0}
  };
}

function createWeights(humanMovePercentages) {
  let obj = {};
  let paPercent = humanMovePercentages.paper;
  let scPercent = humanMovePercentages.scissors;
  let liPercent = humanMovePercentages.lizard;
  let spPercent = humanMovePercentages.spock;
  obj.rock = 100 - paPercent - scPercent - liPercent - spPercent;
  obj.paper = 100 - scPercent - liPercent - spPercent;
  obj.scissors = 100 - liPercent - spPercent;
  obj.lizard = 100 - spPercent;
  obj.spock = 100;
  return obj;
}

RPSGame.play();
