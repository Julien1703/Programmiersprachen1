const alphabet = [
  "france.png",
  "mexico.png",
  "netherlands.png",
  "italy.png",
  "indonesia.png",
  "india.png",
  "germany.png",
  "brazil.png",
  "australlia.png",
  "albania.png",
  "afghanistan.png",
];
const kartenElemente = [];

let currentPlayer = 1;
let cardsPlayer1 = [];
let cardsPlayer2 = [];

let selectedCard1 = null;
let selectedCard2 = null;

let timer;
let timerSeconds = 0;
let anzahlKartenPaare = 4;
let anzahlColumns = 2;

window.onload = (event) => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      switch (button.textContent) {
        case '15 Paare':
          anzahlKartenPaare = 5;
          anzahlColumns = 5;
          break;
        case '20 Paare':
          anzahlKartenPaare = 20;
          anzahlColumns = 6;
          break;
        case '25 Paare':
          anzahlKartenPaare = 25;
          anzahlColumns = 7;
          break;
        case '35 Paare':
          anzahlKartenPaare = 35;
          anzahlColumns = 8;
          break;
        default:
          anzahlKartenPaare = 4;
          anzahlColumns = 2;
      }

      startGame();

      document.querySelector('#currentPlayer').textContent = currentPlayer;
      document.querySelector('#timer').textContent = getFormattedTime(timerSeconds);
      document.querySelector('#card-grid').style.gridTemplateColumns = `repeat(${anzahlColumns},1fr)`;

      kartenElemente.forEach(function (karte) {
        karte.addEventListener('click', function () {
          if (this.classList.contains('back')) {
            if (!selectedCard1) {
              selectedCard1 = this;
              turnCard(selectedCard1);
            } else if (!selectedCard2) {
              selectedCard2 = this;
              turnCard(selectedCard2);
              checkWin();
            }
          }
        });
      });
    });
  });
};

function getKarten() {
  let array = [];
  for (let i = 0; i < anzahlKartenPaare; i++) {
    array.push(alphabet[i]);
    array.push(alphabet[i]);
  }

  let currentIndex = array.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    let temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function erstelleKartenRaster() {
  const kartenRaster = document.getElementById('card-grid');
  const gemischteKarten = getKarten();

  while (kartenRaster.firstChild) {
    kartenRaster.removeChild(kartenRaster.firstChild);
  }

  kartenElemente.length = 0;

  for (let i = 0; i < gemischteKarten.length; i++) {
    const karte = document.createElement('div');
    karte.classList.add('card', 'back');
    karte.dataset.wert = gemischteKarten[i];
    kartenRaster.appendChild(karte);
    kartenElemente.push(karte);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timerSeconds++;
    document.querySelector('#timer').textContent = getFormattedTime(timerSeconds);
  }, 1000);
}

function startGame() {
  currentPlayer = 1;
  cardsPlayer1 = [];
  cardsPlayer2 = [];
  selectedCard1 = null;
  selectedCard2 = null;
  timerSeconds = 0;
  erstelleKartenRaster();
  startTimer();
}

function getFormattedTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function turnCard(card) {
  const wert = card.dataset.wert;
  card.style.backgroundImage = `url(${wert})`;
  card.classList.remove('back');
  card.classList.add('flip');
  card.addEventListener('animationend', function () {
    card.classList.remove('flip');
  });
}

function checkWin() {
  if (selectedCard1.dataset.wert === selectedCard2.dataset.wert) {
    // Karten matchen
    selectedCard1.classList.add('matched');
    selectedCard2.classList.add('matched');
    setTimeout(() => {
      // Karten nach einer Verzögerung ausblenden
      selectedCard1.style.opacity = '0';
      selectedCard2.style.opacity = '0';
      selectedCard1.style.pointerEvents = 'none';
      selectedCard2.style.pointerEvents = 'none';
      if (currentPlayer === 1) {
        cardsPlayer1.push(selectedCard1.dataset.wert);
        document.querySelector('#cardsPlayer1').innerHTML = cardsPlayer1.join(", ");
      } else {
        cardsPlayer2.push(selectedCard1.dataset.wert);
        document.querySelector('#cardsPlayer2').innerHTML = cardsPlayer2.join(", ");
      }
      selectedCard1 = null;
      selectedCard2 = null;
      switchPlayer();
      checkGameEnd();
    }, 1000); // Verzögerung von 1000 ms (1 Sekunde)
  } else {
    // Karten matchen nicht
    setTimeout(() => {
      // Karten nach einer Verzögerung wieder umdrehen
      selectedCard1.style.backgroundImage = '';
      selectedCard1.classList.add('back');
      selectedCard2.style.backgroundImage = '';
      selectedCard2.classList.add('back');
      selectedCard1.classList.remove('nomatch');
      selectedCard2.classList.remove('nomatch');
      selectedCard1 = null;
      selectedCard2 = null;
      switchPlayer();
      checkGameEnd();
    }, 1000); // Verzögerung von 1000 ms (1 Sekunde)
  }
}

function switchPlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  document.querySelector('#currentPlayer').textContent = currentPlayer;
}

function checkGameEnd() {
  if (cardsPlayer1.length + cardsPlayer2.length === anzahlKartenPaare * 2) {
    clearInterval(timer);
    let winner = '';
    if (cardsPlayer1.length > cardsPlayer2.length) {
      winner = 'Spieler 1';
    } else if (cardsPlayer2.length > cardsPlayer1.length) {
      winner = 'Spieler 2';
    } else {
      winner = 'Unentschieden';
    }
    const spielzeit = getFormattedTime(timerSeconds);
    alert(`Spiel beendet! Gewinner: ${winner}. In einer Zeit von ${spielzeit}`);
    gameEnded = true;
  }
}
