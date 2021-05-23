const readline = require('readline-sync');

class Card {
  constructor(rankKey, suit) {
    this.rankKey = rankKey;
    this.rankValue = this.getRankValue(rankKey);
    this.suit = suit;
    this.points = this.getPoints();
  }

  getRankValue(rankKey) {
    let obj = {
      2: "a 2",
      3: "a 3",
      4: "a 4",
      5: "a 5",
      6: "a 6",
      7: "a 7",
      8: "an 8",
      9: "a 9",
      10: "a 10",
      J: "a Jack",
      Q: "a Queen",
      K: "a King",
      A: "an Ace"
    };
    return obj[rankKey];
  }

  getPoints() {
    if (["J", "Q", "K"].includes(this.rankKey)) {
      return 10;
    } else if (this.rankKey === "A") {
      return 11; //points are reduced to 1 in Participant.totalPoints() when initial total is greater than 21
    } else {
      return Number(this.rankKey);
    }
  }
}

class Deck {
  constructor() {
    this.cards = [];
  }

  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10',
    'J', 'Q', 'K', 'A'];
  static SUITS = ["Diamonds", "Hearts", "Spades", "Clubs"];

  initializeDeck() {
    for (let rank = 0; rank < Deck.RANKS.length; rank++) {
      for (let suit = 0; suit < Deck.SUITS.length; suit++) {
        this.cards.push(new Card(Deck.RANKS[rank], Deck.SUITS[suit]));
      }
    }
    this.shuffleDeck(this.cards);
  }

  shuffleDeck(array) {
    for (let index = array.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[otherIndex]] = [array[otherIndex], array[index]];
    }
  }

  deal(player) {
    if (this.cards.length === 0) {
      this.initializeDeck();
    }
    player.hand.push(this.cards.shift());
  }
}

class Participant {
  constructor() {
    this.hand = [];
  }

  totalPoints() {
    let total = 0;
    //add initial total counting aces worth 11 points
    for (let idx = 0; idx < this.hand.length; idx++) {
      total += this.hand[idx].points;
    }
    //cycle through cards again, subtracting 10 for aces when total > 21
    for (let idx = 0; idx < this.hand.length; idx++) {
      if (total > 21 && this.hand[idx].rankKey === "A") {
        total -= 10;
      }
    }
    return total;
  }

  clearHand() {
    this.hand = [];
  }

  hit(deck, player) {
    deck.deal(player);
  }

  isBusted() {
    return this.totalPoints() > 21;
  }
}

class Player extends Participant {
  static DOLLARS_TO_START = 5;
  static DOLLARS_TO_BET = 1;
  static DOLLARS_TO_WIN = 10;
  static DOLLARS_TO_LOSE = 0;

  constructor() {
    super();
    this.dollars = Player.DOLLARS_TO_START;
  }

  isGameWin() {
    return this.dollars >= Player.DOLLARS_TO_WIN;
  }

  isGameLoss() {
    return this.dollars <= Player.DOLLARS_TO_LOSE;
  }
}

class TwentyOneGame {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Participant();
  }

  start() {
    this.deck.initializeDeck();
    this.displayWelcomeMessage();
    while (true) {
      this.playOneGame();
      if (this.player.isGameWin()) {
        this.showWinnerMessage();
        break;
      } else if (this.player.isGameLoss()) {
        this.showLoserMessage();
        break;
      } else if (!this.playAgain()) {
        break;
      }
    }
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Twenty-One!\n");
    console.log(`You have $${this.player.dollars}. For each round, you will bet $${Player.DOLLARS_TO_BET}.`);
    console.log(`Reach $${Player.DOLLARS_TO_WIN} to win or ` +
                `$${Player.DOLLARS_TO_LOSE} to lose.`);
    console.log("");
    readline.question("(Press enter to continue)");
  }

  playOneGame() {
    this.dealCards();
    this.playerTurn();
    this.dealerTurn();
    this.adjustPlayerBalance();
    this.displayTotalPoints();
    this.displayWinner();
    this.player.clearHand();
    this.dealer.clearHand();
  }

  dealCards() {
    this.deck.deal(this.player);
    this.deck.deal(this.dealer);
    this.deck.deal(this.player);
    this.deck.deal(this.dealer);
  }

  playerTurn() {
    this.showAllCards();
    while (!this.player.isBusted()) {
      let choice = this.hitOrStay();
      if (['h', 'hit'].includes(choice)) {
        this.player.hit(this.deck, this.player);
        this.showAllCards();
      } else {
        break;
      }
    }
    if (this.player.isBusted()) {
      console.log('You busted!');
      readline.question("(Press enter to continue)");
    }
  }

  hitOrStay() {
    while (true) {
      let choice = readline.question('Hit or stay? (h/s)').toLowerCase();
      if (['h', 'hit', 's', 'stay'].includes(choice)) return choice;
      console.log("Sorry, that's not valid. Please choose hit or stay. (h/s)");
    }
  }

  dealerTurn() {
    if (!this.player.isBusted()) {
      this.showDealerCards('The dealer revealed their hidden card.\n', 'next');
      while (this.dealer.totalPoints() < 17) {
        this.dealer.hit(this.deck, this.dealer);
        if (this.dealer.totalPoints() <= 21) {
          this.showDealerCards('The dealer hit!\n', 'next');
        } else {
          this.showDealerCards('The dealer hit and busted!\n');
        }
      }
      if (this.dealer.totalPoints() <= 21) {
        this.showDealerCards('The dealer stayed!\n');
      }
    } else {
      this.showDealerCards('The dealer revealed their hidden card.\n');
    }
  }

  showDealerCards(message, action = 'continue') {
    console.clear();
    console.log(message);
    this.showCards(this.dealer, 'dealer');
    if (action === 'next') {
      readline.question("(Press enter to see the dealer's next move)");
    } else {
      readline.question("(Press enter to see the results)");
    }
  }

  showAllCards(turn) {
    console.clear();
    this.showCards(this.player);
    this.showCards(this.dealer, turn);
  }

  showCards(player, turn = 'player') {
    let cards = [];
    for (let idx = 0; idx < player.hand.length; idx++) {
      let rank = player.hand[idx].rankValue;
      let suit = player.hand[idx].suit;
      cards.push(`${rank} of ${suit}`);
    }
    if (player === this.player) {
      console.log(`You have: ${this.joinPlayerCards(cards)}`);
      console.log(`for a total of ${player.totalPoints()} points.\n`);
    } else if (turn === 'dealer') {
      console.log(`The dealer has: ${this.joinDealerCards(cards, turn)}`);
      console.log(`for a total of ${player.totalPoints()} points.\n`);
    } else {
      console.log(`The dealer has: ${this.joinDealerCards(cards, turn)}.\n`);
    }
  }

  joinPlayerCards(cardArray) {
    if (cardArray.length === 2) {
      return cardArray.join(', and ');
    } else {
      let firstPart = cardArray.slice(0, cardArray.length - 1);
      let secondPart = cardArray.slice(cardArray.length - 1);
      return firstPart.join(', ') + ', and ' + secondPart[0];
    }
  }

  joinDealerCards(cardArray, turn = 'player') {
    if (turn === 'dealer') {
      return this.joinPlayerCards(cardArray);
    }
    if (cardArray.length === 2) {
      return `${cardArray[0]}, and a hidden card`;
    } else {
      let firstPart = cardArray.slice(0, cardArray.length - 1);
      return firstPart.join(', ') + ', and a hidden card';
    }
  }

  playAgain() {
    let choice;
    while (true) {
      choice = readline.question("Play again? (y/n)").toLowerCase();
      if (['y', 'yes', 'n', 'no'].includes(choice)) break;
      console.log("Sorry, that isn't valid. Please choose yes or no (y/n)");
    }
    return ['y', 'yes'].includes(choice);
  }

  showWinnerMessage() {
    console.log("You're rich!");
    readline.question("(Press enter to cash in your riches!)");
  }

  showLoserMessage() {
    console.log("You're broke!");
    readline.question("(Press enter to exit the casino!)");
  }

  displayTotalPoints() {
    console.clear();
    if (this.player.isBusted()) {
      console.log(`You busted with a hand of ${this.player.totalPoints()} points ` +
      `and the dealer won with a hand of ${this.dealer.totalPoints()} points.\n`);
    } else if (this.dealer.isBusted()) {
      console.log(`You won with a hand of ${this.player.totalPoints()} points ` +
      `and the dealer busted with a hand of ${this.dealer.totalPoints()} points.\n`);
    } else {
      console.log(`Your hand is worth ${this.player.totalPoints()} points ` +
      `and the dealer's hand is worth ${this.dealer.totalPoints()} points.\n`);
    }
  }

  displayWinner() {
    if (this.isPlayerWin()) {
      console.log('You won the round!');
    } else if (this.isDealerWin()) {
      console.log('The dealer won the round!');
    } else {
      console.log("It's a draw.");
    }
    console.log(`You now have $${this.player.dollars}.\n`);
  }

  isPlayerWin() {
    let playerTotal = this.player.totalPoints();
    let dealerTotal = this.dealer.totalPoints();
    return this.dealer.isBusted() ||
      (playerTotal > dealerTotal && !this.player.isBusted());
  }

  isDealerWin() {
    let playerTotal = this.player.totalPoints();
    let dealerTotal = this.dealer.totalPoints();
    return this.player.isBusted() ||
      (dealerTotal > playerTotal && !this.dealer.isBusted());
  }

  adjustPlayerBalance() {
    if (this.isPlayerWin()) {
      this.player.dollars += Player.DOLLARS_TO_BET;
    } else if (this.isDealerWin()) {
      this.player.dollars -= Player.DOLLARS_TO_BET;
    }
  }

  displayGoodbyeMessage() {
    console.clear();
    console.log("\nThanks for playing Twenty-One!\n");
  }
}

let game = new TwentyOneGame();
game.start();
