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
          anzahlKartenPaare = 15;   // Anzahl der Kartenpaare 
          //anzahlColumns = 9;       // Anzahl der karten pro spalte 
          break;

        case '20 Paare':
          anzahlKartenPaare = 20;
          //anzahlColumns = 8;
          break;

        case '25 Paare':
          anzahlKartenPaare = 25;
          //anzahlColumns = 11;
          break;

        case '35 Paare':
          anzahlKartenPaare = 35;
          //anzahlColumns = 12;
          break;
      }

      startGame();   // Spiel starten

      // Die Textinhalte der Elemente aktualisieren
      document.querySelector('#currentPlayer').textContent = currentPlayer; // Aktualisiert den Textinhalt des Elements mit der ID 'currentPlayer' mit dem aktuellen Spieler
      document.querySelector('#timer').textContent = getFormattedTime(timerSeconds); // Aktualisiert den Textinhalt des Elements mit der ID 'timer' mit der formatierten Spielzeit
      document.querySelector('#card-grid');

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
    // Überprüft, ob der Wert der ersten ausgewählten Karte dem Wert der zweiten ausgewählten Karte entspricht
    selectedCard1.classList.add('matched'); // Fügt der ersten ausgewählten Karte die Klasse 'matched' hinzu (für die Match-Animation)
    selectedCard2.classList.add('matched'); // Fügt der zweiten ausgewählten Karte die Klasse 'matched' hinzu (für die Match-Animation)

    if (currentPlayer === 1) {
      // Überprüft, ob der aktuelle Spieler Spieler 1 ist
      cardsPlayer1.push(selectedCard1.dataset.wert); // Fügt den Wert der ersten ausgewählten Karte dem Array für die Karten des Spielers 1 hinzu
      document.querySelector('#cardsPlayer1').innerHTML = cardsPlayer1.join(", "); // Aktualisiert den Textinhalt des Elements mit der ID 'cardsPlayer1' mit den Karten des Spielers 1
    } else {
      // Wenn der aktuelle Spieler nicht Spieler 1 ist, wird angenommen, dass es Spieler 2 ist
      cardsPlayer2.push(selectedCard1.dataset.wert); // Fügt den Wert der ersten ausgewählten Karte dem Array für die Karten des Spielers 2 hinzu
      document.querySelector('#cardsPlayer2').innerHTML = cardsPlayer2.join(", "); // Aktualisiert den Textinhalt des Elements mit der ID 'cardsPlayer2' mit den Karten des Spielers 2
    }

    setTimeout(() => {
      // Verzögerte Ausführung der folgenden Anweisungen nach 1 Sekunde
      selectedCard1.classList.add('invisible'); // Fügt der ersten ausgewählten Karte die Klasse 'invisible' hinzu (um die Karte auszublenden)
      selectedCard2.classList.add('invisible'); // Fügt der zweiten ausgewählten Karte die Klasse 'invisible' hinzu (um die Karte auszublenden)
      selectedCard1.classList.remove('matched'); // Entfernt die Klasse 'matched' von der ersten ausgewählten Karte
      selectedCard2.classList.remove('matched'); // Entfernt die Klasse 'matched' von der zweiten ausgewählten Karte
      selectedCard1 = null; // Setzt die erste ausgewählte Karte auf null (um für die nächste Runde zurückgesetzt zu werden)
      selectedCard2 = null; // Setzt die zweite ausgewählte Karte auf null (um für die nächste Runde zurückgesetzt zu werden)
      checkGameEnd(); // Überprüft, ob das Spiel beendet ist
    }, 1000); // Wartezeit von 1 Sekunde (1000 Millisekunden)
  } else {
    // Wenn der Wert der ersten ausgewählten Karte nicht dem Wert der zweiten ausgewählten Karte entspricht
    selectedCard1.classList.add('nomatch'); // Fügt der ersten ausgewählten Karte die Klasse 'nomatch' hinzu (für die No-Match-Animation)
    selectedCard2.classList.add('nomatch'); // Fügt der zweiten ausgewählten Karte die Klasse 'nomatch' hinzu (für die No-Match-Animation)

    setTimeout(() => {
      // Verzögerte Ausführung der folgenden Anweisungen nach 1 Sekunde
      selectedCard1.style.backgroundImage = ''; // Entfernt das Hintergrundbild der ersten ausgewählten Karte (um sie zurückzusetzen)
      selectedCard1.classList.add('back'); // Fügt der ersten ausgewählten Karte die Klasse 'back' hinzu (um sie umzudrehen)
      selectedCard2.style.backgroundImage = ''; // Entfernt das Hintergrundbild der zweiten ausgewählten Karte (um sie zurückzusetzen)
      selectedCard2.classList.add('back'); // Fügt der zweiten ausgewählten Karte die Klasse 'back' hinzu (um sie umzudrehen)
      selectedCard1.classList.remove('nomatch'); // Entfernt die Klasse 'nomatch' von der ersten ausgewählten Karte
      selectedCard2.classList.remove('nomatch'); // Entfernt die Klasse 'nomatch' von der zweiten ausgewählten Karte
      selectedCard1 = null; // Setzt die erste ausgewählte Karte auf null (um für die nächste Runde zurückgesetzt zu werden)
      selectedCard2 = null; // Setzt die zweite ausgewählte Karte auf null (um für die nächste Runde zurückgesetzt zu werden)
      switchPlayer(); // Wechselt zum nächsten Spieler
    }, 1000); // Wartezeit von 1 Sekunde (1000 Millisekunden)
  }
}
function switchPlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2; // Wechselt den aktuellen Spieler von 1 auf 2
  } else {
    currentPlayer = 1; // Wechselt den aktuellen Spieler von 2 auf 1
  }
  document.querySelector('#currentPlayer').textContent = currentPlayer; // Aktualisiert den Textinhalt des Elements mit der ID 'currentPlayer' mit der aktuellen Spielerzahl
}
function checkGameEnd() {
  if (cardsPlayer1.length + cardsPlayer2.length === anzahlKartenPaare) {
    // Überprüft, ob die Gesamtanzahl der Karten beider Spieler der Anzahl der Kartenpaare entspricht
    clearInterval(timer); // Stoppt den Timer
    let winner = ''; // Variable für den Gewinner
    if (cardsPlayer1.length > cardsPlayer2.length) {
      winner = 'Spieler 1'; // Setzt den Gewinner auf 'Spieler 1', wenn Spieler 1 mehr Kartenpaare hat
    } else if (cardsPlayer2.length > cardsPlayer1.length) {
      winner = 'Spieler 2'; // Setzt den Gewinner auf 'Spieler 2', wenn Spieler 2 mehr Kartenpaare hat
    } else {
      winner = 'Unentschieden'; // Setzt den Gewinner auf 'Unentschieden', wenn beide Spieler die gleiche Anzahl an Kartenpaaren haben
    }
    const spielzeit = getFormattedTime(timerSeconds); // Ruft die formatierte Spielzeit ab (z.B. "02:30" für 2 Minuten und 30 Sekunden)
    alert(`Spiel beendet! Gewinner: ${winner}. In einer Zeit von ${spielzeit}`); // Zeigt eine Benachrichtigung mit dem Gewinner und der Spielzeit an
    gameEnded = true; // Setzt den Spielstatus auf beendet
  }
}
