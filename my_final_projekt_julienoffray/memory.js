const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const kartenElemente = [];

let currentPlayer = 1;
let cardsPlayer1 = []; //erstellt ein leeres Array das die karten speichert welche der player gefunden hat 
let cardsPlayer2 = []; 

let selectedCard1 = null; // weist der variable selectedCard1 den wert null um die die erste karte zu speichern 
let selectedCard2 = null; 

// mischt karten
function getKarten() {
  let array = []; //dieser array erhählt die karten 
  for (let i = 0; i < anzahlKartenPaare; i++) {   //die schleife läuft so lange durch wie die größe der anzahlKartenPaare ist 
    array.push(alphabet[i]); 
    array.push(alphabet[i]); // schreibt den buchstaben doppelt in den array da man für ein paar zwei mal den gleichen brauch
    console.log(array);
    console.log(alphabet);
  }

  let currentIndex = array.length; //erstellt Variable für den aktuellen Index

  while (currentIndex !== 0) { //Die Schleife läuft so lange bis sie den wert null erreicht 
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex]; // der Wert im Array und der Postition currentIndex  wird in temporaryValue gespeichert 
    array[currentIndex] = array[randomIndex]; //Der wert von cuurrentIndex wird mit dem randomIndex getauscht um um die Karte eine Random Position zu platzieren 
    array[randomIndex] = temporaryValue;  //Setzt den zufälligen Wert an die vorherige Position des aktuellen Werts
  }
  return array;
}

// erstellt Memory Raster 
function erstelleKartenRaster() {
  const kartenRaster = document.getElementById('card-grid'); /// Holt das Spielfeld mit der ID 'card-grid'
  const gemischteKarten = getKarten(); //ruft die Funktion getkarten auf um die karten zu mischen 
  console.log(typeof gemischteKarten);
  
  while (kartenRaster.firstChild) {
    kartenRaster.removeChild(kartenRaster.firstChild);
  }

  kartenElemente.length = 0;
  
  //befüllt das Memory Raster
  for (let i = 0; i < gemischteKarten.length; i++) {
    const karte = document.createElement('div'); // ertsellt ein div für eine Karte 
    karte.classList.add('card', 'back'); //füge der Klasse card und back zu 
    karte.dataset.wert = gemischteKarten[i]; //setzt den Wert data-wert Attribut
    kartenRaster.appendChild(karte); //fügt  zum Spielfeld das kartenElement zu
    kartenElemente.push(karte);
  }
}

//starte Game
function startGame() {
  // Setze die Spieler- und Kartenvariablen zurück
  currentPlayer = 1;
  cardsPlayer1 = [];
  cardsPlayer2 = [];
  selectedCard1 = null;
  selectedCard2 = null;
  erstelleKartenRaster(); //erstellt das KarteRaster
}

// Initialisierung des Spiels und endscheidung wie viel paare der user haben will 
window.onload = (event) => {
  const buttons = document.querySelectorAll('button'); // wählt alle Button-elemente aus 
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
        case '35 Paare':            //Bei 35 Paare sind ein paar Paare undefined !!!!!!!!!!!!!!!!!!!!
          anzahlKartenPaare = 35;
          anzahlColumns = 8;
          break;
        default:
          anzahlKartenPaare = 4;
          anzahlColumns = 2;
      }

      startGame(); //ruft die funltion startgame auf 

      document.querySelector('#currentPlayer').textContent = currentPlayer; //Aktuelleisiere den aktuellen spiel
      document.querySelector('#card-grid').style.gridTemplateColumns = `repeat(${anzahlColumns},1fr)`; //Setzt die Anzahl der Spalten 

      kartenElemente.forEach(function (karte) {
        karte.addEventListener('click', function () { //Setzt ein eventlistener click auf die karten hinzu damit man sie klicken kann
          if (this.classList.contains('back')) {
            if (!selectedCard1) { //schau ob man eine Karte ausgehählt hat 
              selectedCard1 = this; //setzt die ausgewählte Karte als selectedCard1 an 
              turnCard(selectedCard1); //ruft fie funcztion turn card auf um dioe karte zu drehen 
            } else if (!selectedCard2) { 
              selectedCard2 = this; 
              turnCard(selectedCard2); 
              checkWin();  //ruft die function checkWin auf 
            }
          }
        });
      });
    });
  });
}

//karte wird umgedreht 
function turnCard(card) {
  card.classList.remove('back');
  const wert = card.dataset.wert;
  card.textContent = wert;
}

//Es wird geschut ob ob es ein match ist oder keins  wenn ja wird unsichtbar gemacht 
function checkWin() {
  if (selectedCard1.dataset.wert === selectedCard2.dataset.wert) {
    selectedCard1.classList.add('matched');
    selectedCard2.classList.add('matched');
    if (currentPlayer === 1) {
      cardsPlayer1.push(selectedCard1.dataset.wert);
      document.querySelector('#cardsPlayer1').innerHTML = cardsPlayer1.join(", ");
    } else {
      cardsPlayer2.push(selectedCard1.dataset.wert);
      document.querySelector('#cardsPlayer2').innerHTML = cardsPlayer2.join(", ");
    }
    setTimeout(() => {
      selectedCard1.classList.add('invisible');
      selectedCard2.classList.add('invisible');
      selectedCard1.classList.remove('matched');
      selectedCard2.classList.remove('matched');
      selectedCard1 = null;
      selectedCard2 = null;
      checkGameEnd();
    }, 1000);
  } else {
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

//Der spiler wird gewechselt
function switchPlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  document.querySelector('#currentPlayer').textContent = currentPlayer;
}

//Schaut wer gewonnen hat !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function checkGameEnd() {
  if (cardsPlayer1.length + cardsPlayer2.length === anzahlKartenPaare) {
    let winner = '';
    console.log("pouiasdehbfV");
    if (cardsPlayer1.length > cardsPlayer2.length) {
      winner = 'Spieler 1';
      
    } else if (cardsPlayer2.length > cardsPlayer1.length) {
      winner = 'Spieler 2';
    } else {
      winner = 'Unentschieden';
    }
    alert(`Spiel beendet! Gewinner: ${winner}`);
    gameEnded = true;
  }
}
