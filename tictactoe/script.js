'use strict';
let player = true;
let won = false;
document.getElementById('field').addEventListener('click', function(e) {
	if (!won && e.srcElement.classList.contains('cell') && Number(e.srcElement.dataset.type)) {
		e.srcElement.dataset.type = player ? 'o' : 'x';
		var cells = document.getElementsByClassName('cell');
		for (let i = 0; i < 3; i++) {
			if (cells[3 * i].dataset.type === cells[3 * i + 1].dataset.type && cells[3 * i].dataset.type === cells[3 * i + 2].dataset.type) { // Horizontal
				won = true;
			} else if (cells[0 + i].dataset.type === cells[3 + i].dataset.type && cells[0 + i].dataset.type === cells[6 + i].dataset.type) { // Vertikal
				won = true;
			}
		}
		if (cells[0].dataset.type === cells[4].dataset.type && cells[0].dataset.type === cells[8].dataset.type) { // Diagonal \
			won = true;
		} else if (cells[2].dataset.type === cells[4].dataset.type && cells[2].dataset.type === cells[6].dataset.type) { // Diagonal /
			won = true;
		}
		if (won) alert((player ? 'o' : 'x') + ' won');
		if (!won) player = !player;
	}
});

document.getElementById('button').addEventListener('click', function() {
	var cells = document.getElementsByClassName('cell');
	for (let v = 0; v < 9; v++) {
		cells[v].dataset.type = v + 1;
	}
	won = false;
	if (won) player = !player;
})

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js', {scope: '/tictactoe/'});
}