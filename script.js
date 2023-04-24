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

// Variables for gameOver and winGame menu and event listeners

let startGameBtn = document
  .querySelector("#start-game-btn")
  .addEventListener("click", startGame);

let startGameMenu = document.querySelector("#start-game");

let gameOverMenu = document.querySelector("#game-over");

let winGameMenu = document.querySelector("#win-game");

// Variable for reset buttons and event listener

let resetButton = document.querySelectorAll(".btn");
resetButton.forEach((resetButton) => {
  resetButton.addEventListener("click", reset);
});

// Perks variables and event listeners

let catEye = document.querySelector("#cat");
catEye.addEventListener("click", catPotion);

let potionUsed = false;

let axiiSignPerk = document.querySelector("#axii");
axiiSignPerk.addEventListener("click", axiiSign);

let axiiSignUsed = false;

// Audio controls

const popUps = document.querySelectorAll(".pop-up");

// Add a click event listener to each item
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("click", (event) => {
    const popUp = event.currentTarget.querySelector(".pop-up");
    // Toggle the "show" class to show/hide the pop-up
    popUp.classList.toggle("show");
  });
});

// Add a click event listener to the document to hide pop-ups when the user clicks outside of them
document.addEventListener("click", (event) => {
  // Checks wether the clicked element is either a pop-up or item element, pop ups are hidden if it's not
  if (!event.target.closest(".pop-up") && !event.target.closest(".item")) {
    popUps.forEach((popUp) => {
      popUp.classList.remove("show");
    });
  }
});

let mainTheme = document.querySelector("#background-music");
let playPauseIcon = document.querySelector("#play-pause-icon");

let muteButton = document.querySelector("#mute");
muteButton.addEventListener("click", muteToggle);

// key/value

const sounds = {
  flip: new Audio("audio/cardflip.mp3"),
  potion: new Audio("audio/potion.mp3"),
  sign: new Audio("audio/sign.mp3"),
  incorrect: new Audio("audio/incorrect.mp3"),
  correct: new Audio("audio/correct.mp3"),
  lose: new Audio("audio/dead.mp3"),
  win: new Audio("audio/questcompleted.mp3"),
  background: new Audio("audio/LullabyOfWoe.mp3"),
};

sounds.background.volume = 0.1;
sounds.flip.volume = 0.2;
sounds.potion.volume = 0.2;
sounds.sign.volume = 0.2;
sounds.incorrect.volume = 0.2;
sounds.correct.volume = 0.2;
sounds.lose.volume = 0.3;
sounds.win.volume = 0.3;

// Shuffle function that shuffles all the cards in a random order at the start of the game. Loops through each card in cards array and generates random number from 0-15 and sets the order style property to that random number
// the order property is used to specify the order in which the cards should be displayed within their parent container
function shuffle() {
  cards.forEach((card) => {
    let mixAndMatch = Math.floor(Math.random() * 16);
    card.style.order = mixAndMatch;
  });
}

// default screen when game is loaded, the "start menu"
setStartState();

function startGame() {
  setTimeout(function () {
    startGameMenu.style.visibility = "hidden";
    startGameMenu.classList.add("hide");

    sounds.flip.currentTime = 0;
    sounds.flip.play();

    shuffle();

    playMusic();

    cards.forEach((card) => card.addEventListener("click", flipCard));

    catEye.addEventListener("click", catPotion);
    axiiSignPerk.addEventListener("click", axiiSign);

    // loops through each card to make sure its not flipped, and if it is, removes flipped class and sets the source image to back
    cards.forEach((card) => {
      if (card.classList.contains("flipped")) {
        card.classList.remove("flipped");
        card.src = "./images/back.jpg";
      }
    }, 1000);
  });
}

function flipCard(event) {
  // limits the player from choosing more than 2 cards, if there are already 2 cards flipped, the player cant flip any more cards until one of the flipped cards is matched or unflipped
  if (numFlipped < 2) {
    let card = event.target;
    // if the cards are matched, return and dont do anything more with them, should not be able to be flipped or counted towards progression again
    if (card.dataset.matched === "true") {
      return;
    }
    if (firstChoice === null) {
      // adding the class "flipped" to first choice, plays flipping sound, changes the image source to the front image based on the dataset name, increments numflipped by 1 and removes the event listeners from perks to prevent player from clicking on them while choosing the first card
      firstChoice = card;
      firstChoice.classList.add("flipped");
      sounds.flip.currentTime = 0;
      sounds.flip.play();
      firstChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      catEye.removeEventListener("click", catPotion);
      axiiSignPerk.removeEventListener("click", axiiSign);
      // Conditional below prevents the firstChoice card from being the secondChoice card as well
    } else if (secondChoice === null && card !== firstChoice) {
      secondChoice = card;
      secondChoice.classList.add("flipped");
      sounds.flip.currentTime = 0;
      sounds.flip.play();
      secondChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      checkForMatch();
      catEye.addEventListener("click", catPotion);
      axiiSignPerk.addEventListener("click", axiiSign);
    }
  }
}

function checkForMatch() {
  if (firstChoice.dataset.name === secondChoice.dataset.name) {
    // checks if the firstchoice dataset name and secondchoice dataset name are a match
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
    }, 1000);
  }
}

function decreaseWidth() {
  let bar = document.querySelector(".bar-decrement");
  // using parseInt to extract the numeric value of style.width and ignores the "%" symbol
  let currentWidth = parseInt(bar.style.width) || 100;
  let newWidth = currentWidth - 14.29;
  if (newWidth <= 0) {
    // if the bar is less than or == to 0, set lose state and remove the event listeners 
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
    matchContainer.style.boxShadow = "0px 0px 5px 1px #00FF00";
    cards.forEach((card) => card.removeEventListener("click", flipCard));
    setWinState();
    sounds.win.play();
    newWidth = 100;
  }
  bar.style.width = newWidth + "%";
}

function setStartState() {
  // the start game menu, flips all the cards face up and removes event listeners until start game is clicked
  cards.forEach((card) => {
    if (!card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.src = `./images/${card.dataset.name}.jpg`;
      card.removeEventListener("click", flipCard);
    }
  });
  catEye.removeEventListener("click", catPotion);
  axiiSignPerk.removeEventListener("click", axiiSign);
}

function setWinState() {
  // this is called when the player wins and makes this "menu" visible
  setTimeout(function () {
    winGameMenu.style.visibility = "visible";
    winGameMenu.classList.add("show");
  }, 200);
  catEye.removeEventListener("click", catPotion);
  axiiSignPerk.removeEventListener("click", axiiSign);
}

function setLoseState() {
  // this flips over the remaining cards that weren't properly matched and removes event listeners and adds the lose state menu
  cards.forEach((card) => {
    if (!card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.src = `./images/${card.dataset.name}.jpg`;
    }
  });
  setTimeout(function () {
    gameOverMenu.style.visibility = "visible";
    gameOverMenu.classList.add("show");
  }, 200);
  catEye.removeEventListener("click", catPotion);
  axiiSignPerk.removeEventListener("click", axiiSign);
}

function playMusic() {
  // changes the look of the play/pause icon for the background music
  playPauseIcon.addEventListener("click", () => {
    if (mainTheme.paused) {
      mainTheme.play();
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    } else {
      mainTheme.pause();
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    }
  });

  mainTheme.volume = 0.1;
  mainTheme.play();
}

function muteToggle() {
  for (let sound in sounds) {
    // checks if the sound property is "muted" and updates the icon as well
    if (sounds[sound].muted) {
      sounds[sound].muted = false;
      muteButton.classList.remove("fa-solid", "fa-volume-xmark");
      muteButton.classList.add("fa-solid", "fa-volume-high");
    } else {
      sounds[sound].muted = true;
      muteButton.classList.remove("fa-solid", "fa-volume-high");
      muteButton.classList.add("fa-solid", "fa-volume-xmark");
    }
  }
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
    gameOverMenu.classList.remove("show");
    winGameMenu.style.visibility = "hidden";
    winGameMenu.classList.remove("show");

    sounds.flip.currentTime = 0;
    sounds.flip.play();

    // resets perks
    potionUsed = false;
    catEye.style = "";
    catEye.addEventListener("click", catPotion);

    axiiSignUsed = false;
    axiiSignPerk.style = "";
    axiiSignPerk.addEventListener("click", axiiSign);

    // shuffle cards
    shuffle();
  }, 100);
}

function catPotion() {
  // checks if the potion is used, if not used... flips over all the cards that dont have a data matched yet
  if (!potionUsed) {
    cards.forEach((card) => {
      if (card.dataset.matched === "false") {
        card.classList.add("flipped");
        card.src = `./images/${card.dataset.name}.jpg`;
      }
    });

    sounds.potion.currentTime = 0;
    sounds.potion.play();
    sounds.flip.currentTime = 0;
    sounds.flip.play();

    // flips the images back to the back image and sets the potionUsed to true to prevent it being used again
    setTimeout(() => {
      cards.forEach((card) => {
        if (card.dataset.matched === "false") {
          card.classList.remove("flipped");
          card.src = "./images/back.jpg";
        }
      });
    }, 500);
    potionUsed = true;
  }

  catEye.style.border = "3px solid grey";
  catEye.style.transition = "none";
  catEye.style.transform = "none";
  catEye.style.cursor = "auto";
}

function axiiSign() {
  let bar = document.querySelector(".bar-increment");
  let currentWidth = parseInt(bar.style.width) || 0;
  let newWidth = currentWidth + 13.5;

  if (newWidth > 100) {
    newWidth = 100;
  }

  if (!axiiSignUsed) {
    axiiSignUsed = true;

    // filtering the cards that havent been matched yet
    let unmatchedCards = Array.from(cards).filter(
      (card) => card.dataset.matched === "false"
    );
    // if there are less than 2 unmatched cards, return without doing anything
    if (unmatchedCards.length < 2) {
      return;
    }

    // if theres 2 or more unmatched cards, randomly selects one card as firstCard and then searches for a matching card with the same name. if not found, calls itself recursively until a matching card is found.
    // this function is an absolute headache
    let randomIndex = Math.floor(Math.random() * unmatchedCards.length);
    let firstCard = unmatchedCards[randomIndex];
    let firstCardName = firstCard.dataset.name;

    let secondCard = unmatchedCards.find(
      (card) => card.dataset.name === firstCardName && card !== firstCard
    );
    if (!secondCard) {
      // If no matching card is found, call the function again recursively
      axiiSign();
      return;
    }

    // Flip the cards over
    firstCard.classList.add("flipped");
    secondCard.classList.add("flipped");
    firstCard.src = `./images/${firstCard.dataset.name}.jpg`;
    secondCard.src = `./images/${secondCard.dataset.name}.jpg`;
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";
    bar.style.width = newWidth + "%";

    sounds.sign.currentTime = 0;
    sounds.sign.play();
    sounds.flip.currentTime = 0;
    sounds.flip.play();

    unmatchedCards = Array.from(cards).filter(
      (card) => card.dataset.matched === "false"
    );
    // this is to fix when the user clicks the axii sign on the last pair that hasnt been matched yet and ends the game and sets the win state
    if (unmatchedCards.length === 0) {
      setWinState();
      sounds.win.play();
    }
  }

  axiiSignPerk.style.border = "3px solid grey";
  axiiSignPerk.style.transition = "none";
  axiiSignPerk.style.transform = "none";
  axiiSignPerk.style.cursor = "auto";
}
