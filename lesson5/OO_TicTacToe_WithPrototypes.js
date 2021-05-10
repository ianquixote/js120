let readline = require('readline-sync');

// class Square {
//   constructor(marker = Square.UNUSED_SQUARE) {
//     this.marker = marker;
//   }
//
//   toString() {
//     return this.marker;
//   }
//
//   setMarker(marker) {
//     this.marker = marker;
//   }
//
//   getMarker() {
//     return this.marker;
//   }
//
//   isUnused() {
//     return this.marker === Square.UNUSED_SQUARE;
//   }
//
//   static UNUSED_SQUARE = " ";
//   static HUMAN_MARKER = "X";
//   static COMPUTER_MARKER = "O";
// }

function Square(marker) {
  this.marker = marker || Square.UNUSED_SQUARE;
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

Square.prototype.toString = function() {
  return this.marker;
};

Square.prototype.setMarker = function(marker) {
  this.marker = marker;
};

Square.prototype.getMarker = function() {
  return this.marker;
};

Square.prototype.isUnused = function() {
  return this.marker === Square.UNUSED_SQUARE;
};

// class Board {
//   constructor() {
//     this.squares = {};
//     for (let counter = 1; counter <= 9; counter++) {
//       this.squares[String(counter)] = new Square();
//     }
//   }
//
//   display() {
//     console.log("");
//     console.log("     |     |");
//     console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
//     console.log("     |     |");
//     console.log("-----+-----+-----");
//     console.log("     |     |");
//     console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
//     console.log("     |     |");
//     console.log("-----+-----+-----");
//     console.log("     |     |");
//     console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
//     console.log("     |     |");
//     console.log("");
//   }
//
//   markSquareAt(key, marker) {
//     this.squares[key].setMarker(marker);
//   }
//
//   unusedSquares() {
//     let keys = Object.keys(this.squares);
//     return keys.filter(key => this.squares[key].isUnused());
//   }
//
//   isFull() {
//     return this.unusedSquares().length === 0;
//   }
//
//   countMarkersFor(player, keys) {
//     let markers = keys.filter(key => {
//       return this.squares[key].getMarker() === player.getMarker();
//     });
//
//     return markers.length;
//   }
// }

function Board() {
  this.squares = {};
  for (let counter = 1; counter <= 9; counter++) {
    this.squares[String(counter)] = new Square();
  }
}

Board.prototype.display = function() {
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
};

Board.prototype.markSquareAt = function(key, marker) {
  this.squares[key].setMarker(marker);
};

Board.prototype.unusedSquares = function() {
  let keys = Object.keys(this.squares);
  return keys.filter(key => this.squares[key].isUnused());
};

Board.prototype.isFull = function() {
  return this.unusedSquares().length === 0;
};

Board.prototype.countMarkersFor = function(player, keys) {
  let markers = keys.filter(key => {
    return this.squares[key].getMarker() === player.getMarker();
  });

  return markers.length;
};

// class Player {
//   constructor(marker) {
//     this.marker = marker;
//   }
//
//   getMarker() {
//     return this.marker;
//   }
// }

function Player(marker) {
  this.marker = marker;
}

Player.prototype.getMarker = function() {
  return this.marker;
};

// class Human extends Player {
//   constructor() {
//     super(Square.HUMAN_MARKER);
//   }
// }

function Human() {
  this.marker = Square.HUMAN_MARKER;
}

Human.prototype = Object.create(Player.prototype);
Human.prototype.constructor = Human;

// class Computer extends Player {
//   constructor() {
//     super(Square.COMPUTER_MARKER);
//   }
// }

function Computer() {
  this.marker = Square.COMPUTER_MARKER;
}

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

// class TTTGame {
// constructor() {
//   this.board = new Board();
//   this.human = new Human();
//   this.computer = new Computer();
// }

// static POSSIBLE_WINNING_ROWS = [
//   [ "1", "2", "3" ],            // top row of board
//   [ "4", "5", "6" ],            // center row of board
//   [ "7", "8", "9" ],            // bottom row of board
//   [ "1", "4", "7" ],            // left column of board
//   [ "2", "5", "8" ],            // middle column of board
//   [ "3", "6", "9" ],            // right column of board
//   [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
//   [ "3", "5", "7" ]             // diagonal: bottom-left to top-right
// ];

// someoneWon() {
//   return this.isWinner(this.human) || this.isWinner(this.computer);
// }

// play() {
//   console.clear();
//   this.displayWelcomeMessage();
//
//   while (true) {
//     this.board.display();
//
//     this.humanMoves();
//     if (this.gameOver()) break;
//
//     this.computerMoves();
//     if (this.gameOver()) break;
//
//     console.clear();
//     console.log('');
//   }
//
//   console.clear();
//   console.log('');
//   this.board.display();
//
//   this.displayResults();
//   this.displayGoodbyeMessage();
// }

// displayWelcomeMessage() {
//   console.log('Welcome to Tic Tac Toe!');
// }

// displayGoodbyeMessage() {
//   console.log('Thank you for playing Tic Tac Toe. Goodbye!');
// }

// displayResults() {
//   if (this.isWinner(this.human)) {
//     console.log("You won! Congratulations!");
//   } else if (this.isWinner(this.computer)) {
//     console.log("I win! I win! Take that, human!");
//   } else {
//     console.log("A tie game. How boring.");
//   }
// }

// isWinner(player) {
//   return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
//     return this.board.countMarkersFor(player, row) === 3;
//   });
// }

// humanMoves() {
//   let choice;
//
//   while (true) {
//     let validChoices = this.board.unusedSquares();
//     const prompt = `Choose a square (${validChoices.join(', ')})`;
//     choice = readline.question(prompt);
//
//     if (validChoices.includes(choice)) break;
//
//     console.log("Sorry, that is not a valid choice.");
//     console.log("");
//   }
//
//   this.board.markSquareAt(choice, this.human.getMarker());
// }

// computerMoves() {
//   let validChoices = this.board.unusedSquares();
//   let choice;
//
//   do {
//     choice = Math.ceil(9 * Math.random()).toString();
//   } while (!validChoices.includes(choice));
//
//   this.board.markSquareAt(choice, this.computer.getMarker());
// }

// gameOver() {
//   return this.board.isFull() || this.someoneWon();
// }
// }

function TTTGame() {
  this.board = new Board();
  this.human = new Human();
  this.computer = new Computer();
}

TTTGame.POSSIBLE_WINNING_ROWS = [
  [ "1", "2", "3" ],            // top row of board
  [ "4", "5", "6" ],            // center row of board
  [ "7", "8", "9" ],            // bottom row of board
  [ "1", "4", "7" ],            // left column of board
  [ "2", "5", "8" ],            // middle column of board
  [ "3", "6", "9" ],            // right column of board
  [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
  [ "3", "5", "7" ]             // diagonal: bottom-left to top-right
];

TTTGame.prototype.isWinner = function(player) {
  return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
    return this.board.countMarkersFor(player, row) === 3;
  });
};

TTTGame.prototype.someoneWon = function() {
  return this.isWinner(this.human) || this.isWinner(this.computer);
};

TTTGame.prototype.displayWelcomeMessage = function() {
  console.log('Welcome to Tic Tac Toe!');
};

TTTGame.prototype.displayGoodbyeMessage = function() {
  console.log('Thank you for playing Tic Tac Toe. Goodbye!');
};

TTTGame.prototype.displayResults = function() {
  if (this.isWinner(this.human)) {
    console.log("You won! Congratulations!");
  } else if (this.isWinner(this.computer)) {
    console.log("I win! I win! Take that, human!");
  } else {
    console.log("A tie game. How boring.");
  }
};

TTTGame.prototype.humanMoves = function() {
  let choice;

  while (true) {
    let validChoices = this.board.unusedSquares();
    const prompt = `Choose a square: (${validChoices.join(', ')})`;
    choice = readline.question(prompt);

    if (validChoices.includes(choice)) break;

    console.log('Sorry, that is not a valid choice.');
    console.log('');
  }

  this.board.markSquareAt(choice, this.human.getMarker());
};

TTTGame.prototype.computerMoves = function() {
  let validChoices = this.board.unusedSquares();
  let choice;

  do {
    choice = Math.ceil(9 * Math.random()).toString();
  } while (!validChoices.includes(choice));

  this.board.markSquareAt(choice, this.computer.getMarker());
};

TTTGame.prototype.gameOver = function() {
  return this.board.isFull() || this.someoneWon();
};

TTTGame.prototype.play = function() {
  console.clear();
  this.displayWelcomeMessage();

  while (true) {
    this.board.display();

    this.humanMoves();
    if (this.gameOver()) break;

    this.computerMoves();
    if (this.gameOver()) break;

    console.clear();
    console.log('');
  }

  console.clear();
  console.log('');
  this.board.display();

  this.displayResults();
  this.displayGoodbyeMessage();
};

let game = new TTTGame();
game.play();
