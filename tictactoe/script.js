window.addEventListener('load', function() {
	var player = false;
	var won = false;
	var cells = document.getElementsByClassName('cell');

	function getType(id) {
		return cells[id].getAttribute('data-type');
	}

	function checkWin() {
		for (var i = 0; i < 3; i++) {
			// horizontal
			if ((getType(3 * i) === getType(3 * i + 1)) &&
				(getType(3 * i) === getType(3 * i + 2)) &&
				(getType(3 * i) !== '0')) {
				won = true;
			} else

			// vertical
			if ((getType(0 + i) === getType(3 + i)) &&
				(getType(0 + i) === getType(6 + i)) &&
				(getType(0 + i) !== '0')) {
				won = true;
			}
		}

		// diagonal \
		if ((getType(0) === getType(4)) &&
			(getType(0) === getType(8)) &&
			(getType(0) !== '0')) {
			won = true;
		} else

		// diagonal /
		if ((getType(2) === getType(4)) &&
			(getType(2) === getType(6)) &&
			(getType(2) !== '0')) {
			won = true;
		}
	}

	document.getElementById('field').addEventListener('click', function(e) {
		var type = e.target.getAttribute('data-type');
		if (!won && type === '0') {
			e.target.setAttribute('data-type', (player ? 2 : 1));
			checkWin();
			if (won) alert((player ? 'o' : 'x') + ' won');
			player = !player;
		}
	}, false);

	document.getElementById('button').addEventListener('click', function() {
		for (var i = 0; i < cells.length; i++) {
			cells[i].setAttribute('data-type', 0);
		}
		won = false;
	}, false);

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js?path=tictactoe');
	}
});