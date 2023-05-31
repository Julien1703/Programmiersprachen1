// Array 20 Paare
const karten = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q', 'R', 'R', 'S', 'S', 'T', 'T', 'U', 'U'];

// mischt karten
function mischeArray(array) {
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
  const kartenRaster = document.getElementById('karten-raster');
  const gemischteKarten = mischeArray(karten);

  //befüllt das Memory Raster
  for (let i = 0; i < gemischteKarten.length; i++) {
    const karte = document.createElement('div');
    karte.classList.add('card', 'back');
    karte.dataset.wert = gemischteKarten[i];
    kartenRaster.appendChild(karte);
  }
}

// Klick Event hinzufügen
document.addEventListener('DOMContentLoaded', function () {
  erstelleKartenRaster();

  const karten = document.querySelectorAll('.card');
  let vorherigeKarte = null;

  karten.forEach(function (karte) {
    karte.addEventListener('click', function () {
      if (this.classList.contains('back')) {
        this.classList.remove('back');
        const wert = this.dataset.wert;
        this.textContent = wert;

        if (!vorherigeKarte) {
          vorherigeKarte = this;
        } else {
          if (vorherigeKarte.dataset.wert === this.dataset.wert) {
            vorherigeKarte.classList.add('matched');
            this.classList.add('matched');
            vorherigeKarte = null;
          } else {
            setTimeout(() => {
              vorherigeKarte.classList.add('back');
              this.classList.add('back');
              vorherigeKarte.textContent = '';
              this.textContent = '';
              vorherigeKarte = null;
            }, 1000);
          }
        }
      }
    });
  });
});
