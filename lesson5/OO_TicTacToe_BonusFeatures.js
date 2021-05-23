let readline = require('readline-sync');

class Square {
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  unusedSquareInRow(row) {
    return row.find(key => this.squares[key].isUnused());
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  clearBoard() {
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = new Square();
    }
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }

}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ]             // diagonal: bottom-left to top-right
  ];

  static MATCH_GOAL = 3;

  chooseFirstPlayer() {
    let player;
    while (true) {
      player = readline.question('Who will go first? (human/computer)');
      if (['human', 'h', 'myself','me'].includes(player.toLowerCase())) {
        player = this.human;
        break;
      } else if (['computer', 'c', 'comp'].includes(player.toLowerCase())) {
        player = this.computer;
        break;
      } else {
        console.log("Sorry, that is not a valid choice. Please try again.");
      }
    }
    return player;
  }

  play() {
    console.clear();
    this.displayWelcomeMessage();
    this.board.display();
    this.firstPlayer = this.chooseFirstPlayer();

    while (true) {
      this.playOneRound();

      this.board.displayWithClear();
      this.displayResults();

      if (this.matchWon() || !this.playAgain()) break;
      this.board.clearBoard();
      this.board.displayWithClear();
      this.firstPlayer = this.togglePlayer(this.firstPlayer);
    }

    this.displayGoodbyeMessage();
  }

  playOneRound() {
    let currentPlayer = this.firstPlayer;
    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.board.displayWithClear();
      currentPlayer = this.togglePlayer(currentPlayer);
    }
  }

  playerMoves(currentPlayer) {
    if (currentPlayer === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  togglePlayer(currentPlayer) {
    if (currentPlayer === this.human) {
      return this.computer;
    } else {
      return this.human;
    }
  }

  displayWelcomeMessage() {
    console.log('Welcome to Tic Tac Toe!');
  }

  displayGoodbyeMessage() {
    console.log('Thank you for playing Tic Tac Toe. Goodbye!');
  }

  matchWon() {
    return this.human.score === TTTGame.MATCH_GOAL ||
           this.computer.score === TTTGame.MATCH_GOAL;
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
      this.human.score++;
      this.displayScore();
    } else if (this.isWinner(this.computer)) {
      console.log("I win! I win! Take that, human!");
      this.computer.score++;
      this.displayScore();
    } else {
      console.log("A tie game. How boring.");
      this.displayScore();
    }
  }

  displayScore() {
    console.log(`The score is, Human: ${this.human.score}, Computer: ${this.computer.score}.`);
  }

  playAgain() {
    let choice;
    while (true) {
      let prompt = "Would you like to play again? (y/n)";
      choice = readline.question(prompt).toLowerCase();
      if (choice === 'y' || choice === 'n') break;
      console.log('Sorry, that is not a valid choice.');
    }
    return choice === 'y';
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${this.joinOr(validChoices)})`;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that is not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;
    let rowToWin = this.detectWin(this.computer, this.human);
    let rowToDefend = this.detectWin(this.human, this.computer);

    if (rowToWin) {
      choice = this.board.unusedSquareInRow(rowToWin);
    } else if (rowToDefend) {
      choice = this.board.unusedSquareInRow(rowToDefend);
    } else if (this.board.squares["5"].isUnused()) {
      choice = "5";
    } else {
      do {
        choice = Math.ceil(9 * Math.random()).toString();
      } while (!validChoices.includes(choice));
    }
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  detectWin(winner, loser) {
    return TTTGame.POSSIBLE_WINNING_ROWS.find(row => {
      return this.board.countMarkersFor(winner, row) === 2 &&
             this.board.countMarkersFor(loser, row) === 0;
    });
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  joinOr(array, delimiter = ',', option = 'or') {
    if (array.length === 1) {
      return array[0];
    } else if (array.length === 2) {
      return array.join(` ${option} `);
    } else {
      let firstPart = array.slice(0, array.length - 1);
      let secondPart = array[array.length - 1];
      return firstPart.join(`${delimiter} `) + ` ${option} ` + secondPart;
    }
  }
}

let game = new TTTGame();
game.play();
