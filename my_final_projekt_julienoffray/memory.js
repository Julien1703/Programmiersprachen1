const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const kartenElemente = [];

const anzahlKartenPaare = 4; // achtung: max länge von alphabet
const anzahlColumns = 3;

let currentPlayer = 1;
let cardsPlayer1 = [];
let cardsPlayer2 = [];

let selectedCard1 = null;
let selectedCard2 = null;


// mischt karten
function getKarten() {
  let array = [];
  for (let i = 0; i < anzahlKartenPaare; i++) {
    array.push(alphabet[i]);
    array.push(alphabet[i]);
  }
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// erstellt Memory Raster 
function erstelleKartenRaster() {
  const kartenRaster = document.getElementById('card-grid');
  const gemischteKarten = getKarten();

  //befüllt das Memory Raster
  for (let i = 0; i < gemischteKarten.length; i++) {
    const karte = document.createElement('div');
    karte.classList.add('card', 'back');
    karte.dataset.wert = gemischteKarten[i];
    kartenRaster.appendChild(karte);
    kartenElemente.push(karte);
  }
}

// Initialisierung des Spiels
window.onload = (event) => {

  document.querySelector('#currentPlayer').textContent = currentPlayer;
  document.querySelector('#card-grid').style.gridTemplateColumns = `repeat(${anzahlColumns},1fr)`;

  erstelleKartenRaster();

  kartenElemente.forEach(function (karte) {
    karte.addEventListener('click', function () {
      if (this.classList.contains('back')) {
        if (!selectedCard1) {
          selectedCard1 = this;
          turnCard(selectedCard1);
        }
        else if (!selectedCard2) {
          selectedCard2 = this;
          turnCard(selectedCard2);
          checkWin();
        }
      }
    });
  });
}

function turnCard(card) {
  card.classList.remove('back');
  const wert = card.dataset.wert;
  card.textContent = wert;
}

function checkWin() {
  if (selectedCard1.dataset.wert === selectedCard2.dataset.wert) {
    // wenn match
    selectedCard1.classList.add('matched');
    selectedCard2.classList.add('matched');
    if (currentPlayer === 1) {
      cardsPlayer1.push(selectedCard1.dataset.wert);
      document.querySelector('#cardsPlayer1').innerHTML = cardsPlayer1.join(", ");
    }
    else {
      cardsPlayer2.push(selectedCard1.dataset.wert);
      document.querySelector('#cardsPlayer2').innerHTML = cardsPlayer2.join(", ");
    }
    setTimeout(() => {
      selectedCard1.classList.add('invisible');
      selectedCard2.classList.add('invisible');
      selectedCard1.classList.remove('match');
      selectedCard2.classList.remove('match');
      selectedCard1 = null;
      selectedCard2 = null;
    }, 1000);

  } else {
    // kein match
    selectedCard1.classList.add('nomatch');
    selectedCard2.classList.add('nomatch');
    setTimeout(() => {
      selectedCard1.classList.add('back');
      selectedCard2.classList.add('back');
      selectedCard1.classList.remove('nomatch');
      selectedCard2.classList.remove('nomatch');
      selectedCard1.textContent = '';
      selectedCard2.textContent = '';
      selectedCard1 = null;
      selectedCard2 = null;
      switchPlayer();
    }, 1000);
  }
}

function switchPlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  }
  else {
    currentPlayer = 1;
  }
  document.querySelector('#currentPlayer').textContent = currentPlayer;
}

