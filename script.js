// Variable selector for the all the cards and forEach method to loop through all the cards

let cards = document.querySelectorAll(".back");

cards.forEach((card) => card.addEventListener("click", flipCard));

// Variables for card choices

let firstChoice = null;
let secondChoice = null;
let numFlipped = 0;

// Selectors and variables for the menu

let lifeBar = document.querySelector(".bar-decrement");
let matchBar = document.querySelector(".bar-increment");

let lifeContainer = document.querySelector(".life");
let matchContainer = document.querySelector(".match");

// Variables for gameOver and winGame menu

let startGameBtn = document
  .querySelector("#start-game-btn")
  .addEventListener("click", startGame);

let startGameMenu = document.querySelector("#start-game");

let gameOverMenu = document.querySelector("#game-over");

let winGameMenu = document.querySelector("#win-game");

// Variable for reset buttons

let resetButton = document.querySelectorAll(".btn");
resetButton.forEach((resetButton) => {
  resetButton.addEventListener("click", reset);
});

// Audio controls

let mainTheme = document.querySelector("#background-music");

const sounds = {
  flip: new Audio("audio/cardflip.mp3"),
  potion: new Audio("audio/potion.mp3"),
  incorrect: new Audio("audio/incorrect.mp3"),
  correct: new Audio("audio/correct.mp3"),
  lose: new Audio("audio/dead.mp3"),
  win: new Audio("audio/questcompleted.mp3"),
  background: new Audio("audio/LullabyOfWoe.mp3"),
};

sounds.background.volume = 0.1;
sounds.flip.volume = 0.2;
sounds.potion.volume = 0.2;
sounds.incorrect.volume = 0.2;
sounds.correct.volume = 0.2;
sounds.lose.volume = 0.3;
sounds.win.volume = 0.3;

// Shuffle function that shuffles all the cards in a random order at the start of the game
function shuffle() {
  cards.forEach((card) => {
    let mixAndMatch = Math.floor(Math.random() * 16);
    card.style.order = mixAndMatch;
  });
}

setStartState();

function startGame() {
  setTimeout(function () {
    startGameMenu.style.visibility = "hidden";
    startGameMenu.classList.add("hide");

    shuffle();

    // playMusic();

    cards.forEach((card) => card.addEventListener("click", flipCard));

    cards.forEach((card) => {
      if (card.classList.contains("flipped")) {
        card.classList.remove("flipped");
        card.src = "./images/back.jpg";
      }
    }, 1000);
  });
}

function flipCard(event) {
  if (numFlipped < 2) {
    let card = event.target;
    if (card.dataset.matched === "true") {
      return;
    }
    if (firstChoice === null) {
      firstChoice = card;
      firstChoice.classList.add("flipped");
      sounds.flip.currentTime = 0;
      sounds.flip.play();
      firstChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      // Conditional below prevents the firstChoice card from being the secondChoice card as well
    } else if (secondChoice === null && card !== firstChoice) {
      secondChoice = card;
      secondChoice.classList.add("flipped");
      sounds.flip.currentTime = 0;
      sounds.flip.play();
      secondChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      checkForMatch();
    }
  }
}

function checkForMatch() {
  if (firstChoice.dataset.name === secondChoice.dataset.name) {
    setTimeout(function () {
      firstChoice.dataset.matched = "true";
      secondChoice.dataset.matched = "true";
      increaseWidth();
      sounds.correct.currentTime = 0;
      sounds.correct.play();
      numFlipped = 0;
      firstChoice = null;
      secondChoice = null;
    }, 300);
  } else {
    setTimeout(function () {
      firstChoice.classList.remove("flipped");
      secondChoice.classList.remove("flipped");
      firstChoice.src = "./images/back.jpg";
      secondChoice.src = "./images/back.jpg";
      numFlipped = 0;
      firstChoice = null;
      secondChoice = null;
      decreaseWidth();
      sounds.incorrect.currentTime = 0;
      sounds.incorrect.play();
      sounds.potion.currentTime = 0;
      sounds.potion.play();
    }, 1000);
  }
}

function decreaseWidth() {
  let bar = document.querySelector(".bar-decrement");
  let currentWidth = parseInt(bar.style.width) || 100;
  let newWidth = currentWidth - 14.29;
  if (newWidth <= 0) {
    lifeContainer.style.boxShadow = "0px 0px 10px 5px #ff0000cc";
    cards.forEach((card) => card.removeEventListener("click", flipCard));
    setLoseState();
    sounds.lose.play();
    newWidth = 0;
  }
  bar.style.width = newWidth + "%";
}

function increaseWidth() {
  let bar = document.querySelector(".bar-increment");
  let currentWidth = parseInt(bar.style.width) || 0;
  let newWidth = currentWidth + 13.5;
  if (newWidth >= 100) {
    matchContainer.style.boxShadow = "0px 0px 5px 2px #00FF00";
    cards.forEach((card) => card.removeEventListener("click", flipCard));
    setWinState();
    sounds.win.play();
    newWidth = 100;
  }
  bar.style.width = newWidth + "%";
}

function setStartState() {
  cards.forEach((card) => {
    if (!card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.src = `./images/${card.dataset.name}.jpg`;
      card.removeEventListener("click", flipCard);
    }
    // startGameMenu.style.visibility = "visible";
    // startGameMenu.classList.add("show");
  });
}

function setWinState() {
  // sounds.background.pause();
  setTimeout(function () {
    winGameMenu.style.visibility = "visible";
    winGameMenu.classList.add("show");
  }, 200);
}

function setLoseState() {
  cards.forEach((card) => {
    if (!card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.src = `./images/${card.dataset.name}.jpg`;
    }
  });
  // sounds.background.pause();
  setTimeout(function () {
    gameOverMenu.style.visibility = "visible";
    gameOverMenu.classList.add("show");
  }, 200);
}

function playMusic() {
  let backgroundMusic = mainTheme;
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
}

// Function for new game and reset

function reset() {
  setTimeout(function () {
    // flip all cards back over
    cards.forEach((card) => {
      card.classList.remove("flipped");
      card.dataset.matched = "false";
      card.src = "./images/back.jpg";
      card.addEventListener("click", flipCard);
    });

    // reset game variables
    firstChoice = null;
    secondChoice = null;
    numFlipped = 0;
    lifeBar.style.width = "100%";
    matchBar.style.width = "0%";
    matchContainer.style.boxShadow = "none";
    lifeContainer.style.boxShadow = "none";

    // hide game over and win game menus
    gameOverMenu.style.visibility = "hidden";
    winGameMenu.style.visibility = "hidden";

    // shuffle cards and play background music

    shuffle();

    // playMusic();
  }, 100);
}
