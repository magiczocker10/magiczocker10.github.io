"use strict";
var player = false;
var won = false;

document.getElementById("field").addEventListener("click", function(e) {
    if (!won && Number(e.srcElement.dataset.type)) {
        e.srcElement.dataset.type = player ? "o" : "x";
		var rows = document.getElementById('field').rows;
        for (var i = 0; i < 3; i++) {
			if (rows[i].cells[0].dataset.type === rows[i].cells[1].dataset.type && rows[i].cells[0].dataset.type === rows[i].cells[2].dataset.type) { // Horizontal
				won = true;
			} else if (rows[0].cells[i].dataset.type === rows[1].cells[i].dataset.type && rows[0].cells[i].dataset.type === rows[2].cells[i].dataset.type) { // Vertikal
				won = true;
			}
		}
		if (rows[0].cells[0].dataset.type === rows[1].cells[1].dataset.type && rows[1].cells[1].dataset.type === rows[2].cells[2].dataset.type) { // Diagonal \
			won = true;
		} else if (rows[0].cells[2].dataset.type === rows[1].cells[1].dataset.type && rows[1].cells[1].dataset.type === rows[2].cells[0].dataset.type) { // Diagonal /
			won = true;
		}
		if (won) alert((player ? 'o' : 'x') + ' won');
		player = !player;
    }
});

document.getElementById("button").addEventListener("click", function() {
	var rows = document.getElementById('field').rows;
	for (var i=0; i<rows.length; i++) {
		for (var j=0; j<rows[i].cells.length; j++) {
			rows[i].cells[j].dataset.type = 3 * i + j + 1;
		}
	}
	won = false;
});