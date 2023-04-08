let cards = document.querySelectorAll(".card");

cards.forEach((card) => card.addEventListener("click", flipCard));

let firstChoice = null;
let secondChoice = null;
let numFlipped = 0;

let cardsMatched = document.querySelector("#matched");
let matched = 0;

let livesLeft = document.querySelector("#lives");
let lives = 7;

function shuffle() {
  cards.forEach((card) => {
    let mixAndMatch = Math.floor(Math.random() * 16);
    card.style.order = mixAndMatch;
  });
}

shuffle();

function flipCard(event) {
  if (numFlipped < 2) {
    let card = event.target;
    if (card.dataset.matched === "true") {
      return;
    }
    if (firstChoice === null) {
      firstChoice = card;
      firstChoice.classList.add("flipped");
      firstChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      // Remove click event listener from the firstChoice element.
      firstChoice.removeEventListener("click", flipCard);
    } else if (secondChoice === null && card !== firstChoice) {
      secondChoice = card;
      secondChoice.classList.add("flipped");
      secondChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      checkForMatch();
    }
  }
}

function checkForMatch() {
  if (firstChoice.dataset.name === secondChoice.dataset.name) {
    firstChoice.dataset.matched = "true";
    secondChoice.dataset.matched = "true";
    matchedCounter();
    firstChoice = null;
    secondChoice = null;
    numFlipped = 0;
  } else {
    setTimeout(function () {
      firstChoice.classList.remove("flipped");
      secondChoice.classList.remove("flipped");
      firstChoice.src = "./images/back.jpg";
      secondChoice.src = "./images/back.jpg";
      numFlipped = 0;
      firstChoice = null;
      secondChoice = null;
      livesCounter();
    }, 1000);
  }
}

function matchedCounter() {
  matched++;
  cardsMatched.innerHTML = matched;
  matched >= 8 ? (cardsMatched.style.color = "green") : "";
}

function livesCounter() {
  lives--;
  livesLeft.innerHTML = lives;
  lives <= 0 ? (livesLeft.style.color = "red") : "";
}
