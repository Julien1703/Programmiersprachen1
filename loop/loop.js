// Funktion, um die Soundbars zu animieren
function fluctuate(bar) {
    // Zufällige Amplitude berechnen
    var amplitude = Math.random() * 42;
    console.log(amplitude);

    // Höhe der Soundbar basierend auf der Amplitude berechnen
    var height = amplitude * 4;

    // Die Höhe der Soundbar animieren
    bar.animate({
        height: height
    }, 1000, function() {
        // Wenn die Animation abgeschlossen ist, die Funktion erneut aufrufen
        fluctuate(bar);
    });
}

// Schleife, um die Funktion für jede Soundbar auszuführen
for (var i = 0; i < $(".bar").length; i++) {
    fluctuate($(".bar").eq(i));
}
