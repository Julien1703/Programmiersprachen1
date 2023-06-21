const alphabet = [
  "icon1.jpg",                // Namen der Bilddateien für die Karten
  "icon2.jpg",
  "icon3.jpg",
  "icon4.jpg",
  "icon5.jpg",
  "icon6.jpg",
  "icon7.jpg",
  "icon8.jpg",                
  "icon9.jpg",
  "icon10.jpg",
  "icon11.jpg",
  "icon12.jpg",
  "icon13.jpg",
  "icon14.jpg",
  "icon15.jpg",                
  "icon16.jpg",
  "icon17.jpg",
  "icon18.jpg",
  "icon19.jpg",
  "icon20.jpg",
  "icon21.jpg",
  "icon22.jpg",                
  "icon23.jpg",
  "icon24.jpg",
  "icon25.jpg",
  "icon26.jpg",
  "icon27.jpg",
  "icon28.jpg",
  "icon29.jpg",                
  "icon30.jpg",
  "icon31.jpg",
  "icon32.jpg",
  "icon33.jpg",
  "icon34.jpg",
  "icon35.jpg",
];

const kartenElemente = [];       // Array zur Speicherung der DOM-Elemente der Spielkarten

let currentPlayer = 1;          // Aktueller Spieler (1 oder 2)
let cardsPlayer1 = [];          // Gefundene Karten von Spieler 1
let cardsPlayer2 = [];          // Gefundene Karten von Spieler 2

let selectedCard1 = null;       // Erste ausgewählte Karte
let selectedCard2 = null;       // Zweite ausgewählte Karte

let timer;                      // Timer-Intervall für die Spielzeit
let timerSeconds = 0;           // Anzahl der vergangenen Sekunden

window.onload = (event) => {
  const buttons = document.querySelectorAll('button');   // Alle Buttons auf der Seite auswählen

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      switch (button.textContent) {
        case '15 Paare':           // Wenn der Button "15 Paare" geklickt wurde
          anzahlKartenPaare = 15;   // Anzahl der Kartenpaare auf 5 setzen
          anzahlColumns = 9;       // Anzahl der Spalten auf 5 setzen
          break;

        case '20 Paare':
          anzahlKartenPaare = 20;
          anzahlColumns = 10;
          break;

        case '25 Paare':
          anzahlKartenPaare = 25;
          anzahlColumns = 11;
          break;

        case '35 Paare':
          anzahlKartenPaare = 35;
          anzahlColumns = 12;
          break;
      }

      startGame();   // Spiel starten

      // Die Textinhalte der Elemente aktualisieren
      document.querySelector('#currentPlayer').textContent = currentPlayer; // Aktualisiert den Textinhalt des Elements mit der ID 'currentPlayer' mit dem aktuellen Spieler
      document.querySelector('#timer').textContent = getFormattedTime(timerSeconds); // Aktualisiert den Textinhalt des Elements mit der ID 'timer' mit der formatierten Spielzeit
      document.querySelector('#card-grid').style.gridTemplateColumns = `repeat(${anzahlColumns},1fr)`; // Ändert die Anzahl der Spalten im Kartengitter basierend auf der Anzahl der Spalten (anzahlColumns)

      kartenElemente.forEach(function (karte) {
        karte.addEventListener('click', function () {
          if (this.classList.contains('back')) { // Überprüft, ob die angeklickte Karte die Klasse 'back' enthält
            if (!selectedCard1) {
              selectedCard1 = this; // Weist der ersten ausgewählten Karte die aktuell angeklickte Karte zu
              turnCard(selectedCard1); // Dreht die ausgewählte Karte um
            } else if (!selectedCard2) {
              selectedCard2 = this; // Weist der zweiten ausgewählten Karte die aktuell angeklickte Karte zu
              turnCard(selectedCard2); // Dreht die ausgewählte Karte um
              checkWin();
            }
          }
        });
      });
      buttons.forEach((button) => {
        button.style.display = "none";
      })
    });
  });
};

function getKarten() {
  let array = [];

  for (let i = 0; i < anzahlKartenPaare; i++) {
    array.push(alphabet[i]);     // Fügt das i-te Kartenpaar zum Array hinzu
    array.push(alphabet[i]);     // Fügt das i-te Kartenpaar erneut zum Array hinzu
  }

  let currentIndex = array.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Elemente im Array zufällig vertauschen
    let temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array; // Gibt das gemischte Kartenarray zurück
}

function erstelleKartenRaster() {
  const kartenRaster = document.getElementById('card-grid');
  const gemischteKarten = getKarten(); // Ruft die Funktion getKarten() auf, um das gemischte Kartenarray zu erhalten

  while (kartenRaster.firstChild) {
    kartenRaster.removeChild(kartenRaster.firstChild); // Entfernt alle vorhandenen Kinder des Kartengitters
  }

  kartenElemente.length = 0; // Setzt das kartenElemente-Array zurück

  for (let i = 0; i < gemischteKarten.length; i++) {
    const karte = document.createElement('div'); // Erstellt ein neues <div>-Element für eine Karte
    karte.classList.add('card', 'back'); // Fügt die Klassen 'card' und 'back' zur Karte hinzu
    karte.dataset.wert = gemischteKarten[i]; // Setzt den Wert des daten-Attributs 'wert' auf den Wert der aktuellen Karte
    kartenRaster.appendChild(karte); // Fügt die Karte dem Kartengitter hinzu
    kartenElemente.push(karte); // Fügt die Karte dem kartenElemente-Array hinzu
  }
}

function startTimer() {
  timer = setInterval(() => {
    timerSeconds++;
    document.querySelector('#timer').textContent = getFormattedTime(timerSeconds); // Aktualisiert den Textinhalt des Elements mit der ID 'timer' mit der formatierten Spielzeit
  }, 1000); // Timer wird alle 1000 Millisekunden (1 Sekunde) erhöht
}

function startGame() {
  currentPlayer = 1; // Setzt den aktuellen Spieler auf Spieler 1
  cardsPlayer1 = []; // Leeres Array für die Karten des Spielers 1
  cardsPlayer2 = []; // Leeres Array für die Karten des Spielers 2
  selectedCard1 = null; // Die erste ausgewählte Karte wird auf null gesetzt
  selectedCard2 = null; // Die zweite ausgewählte Karte wird auf null gesetzt
  timerSeconds = 0; // Die Spielzeit wird auf 0 gesetzt
  erstelleKartenRaster(); // Erstellt das Kartenraster mit den Karten
  startTimer(); // Startet den Timer
}

function getFormattedTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0'); // Berechnet die Minuten aus den Sekunden
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0'); // Berechnet die verbleibenden Sekunden
  return `${minutes}:${remainingSeconds}`; // Gibt die formatierte Spielzeit zurück (z.B. "02:30" für 2 Minuten und 30 Sekunden)
}

function turnCard(card) {
  const wert = card.dataset.wert; // Der Wert der ausgewählten Karte wird aus dem daten-Attribut 'wert' gelesen
  card.style.backgroundImage = `url(${wert})`; // Ändert das Hintergrundbild der Karte basierend auf ihrem Wert
  card.classList.remove('back'); // Entfernt die Klasse 'back' von der Karte
  card.classList.add('flip'); // Fügt die Klasse 'flip' zur Karte hinzu (für die Flip-Animation)
  card.addEventListener('animationend', function () {
    card.classList.remove('flip'); // Entfernt die Klasse 'flip' von der Karte nach Abschluss der Animation
  });
}

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
      selectedCard1.style.backgroundImage = '';
      selectedCard1.classList.add('back');
      selectedCard2.style.backgroundImage = '';
      selectedCard2.classList.add('back');
      selectedCard1.classList.remove('nomatch');
      selectedCard2.classList.remove('nomatch');
      selectedCard1 = null;
      selectedCard2 = null;
      switchPlayer();
    }, 1000);
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
  if (cardsPlayer1.length + cardsPlayer2.length === anzahlKartenPaare) {
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
