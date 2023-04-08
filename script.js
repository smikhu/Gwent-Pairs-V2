let cards = document.querySelectorAll(".card");

cards.forEach((card) => card.addEventListener("click", flipCard));

let firstChoice = null;
let secondChoice = null;
let numFlipped = 0;

function shuffle() {
  cards.forEach((card) => {
    let mixAndMatch = Math.floor(Math.random() * 16);
    card.style.order = mixAndMatch;
  });
}

shuffle();

function flipCard(event) {
  // Only allow the user to flip cards if less than two cards are flipped
  if (numFlipped < 2) {
    if (firstChoice === null) {
      firstChoice = event.target;
      firstChoice.classList.add("flipped");
      firstChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
    } else if (secondChoice === null) {
      secondChoice = event.target;
      secondChoice.classList.add("flipped");
      secondChoice.src = `./images/${this.dataset.name}.jpg`;
      numFlipped++;
      checkForMatch();
    }
  }
}

function checkForMatch() {
  if (firstChoice.dataset.name === secondChoice.dataset.name) {
    firstChoice = null;
    secondChoice = null;
    numFlipped = 0;
  } else {
    setTimeout(function () {
      firstChoice.classList.remove("flipped");
      secondChoice.classList.remove("flipped");
      console.log(firstChoice)
      console.log(secondChoice)
      firstChoice.src = "./images/back.jpg";
      secondChoice.src = "./images/back.jpg";
      numFlipped = 0;
      firstChoice = null;
      secondChoice = null;
    }, 1000);
  }
}
