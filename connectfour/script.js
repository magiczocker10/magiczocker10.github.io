var player = false;
var won = false;
var field = document.getElementById('field').tBodies[0].rows;

function getType(x, y) {
	return field[y].cells[x].getAttribute('data-type');
}

function checkWin() {
	// horizontal
	for (var row = 0; row < 6; row++) {
		for (var column = 0; column < 4; column++) {
			if ((getType(column, row) === getType(column + 1, row)) &&
				(getType(column, row) === getType(column + 2, row)) &&
				(getType(column, row) === getType(column + 3, row)) &&
				(getType(column, row) !== '0')) {
				won = true;
			}
		}
	}

	// vertical
	for (var column = 0; column < 7; column++) {
		for (var row = 0; row < 3; row++) {
			if ((getType(column, row) === getType(column, row + 1)) &&
				(getType(column, row) === getType(column, row + 2)) &&
				(getType(column, row) === getType(column, row + 3)) &&
				(getType(column, row) !== '0')) {
				won = true;
			}
		}
	}

	for (var row = 0; row < 3; row++) {
		for (var column = 0; column < 4; column++) {
			// diagonal \
			if ((getType(column, row + 3) === getType(column + 1, row + 2)) &&
				(getType(column, row + 3) === getType(column + 2, row + 1)) &&
				(getType(column, row + 3) === getType(column + 3, row)) &&
				(getType(column, row + 3) !== '0')) {
				won = true;
			} else

			// diagonal /
			if ((getType(column, row) === getType(column + 1, row + 1)) &&
				(getType(column, row) === getType(column + 2, row + 2)) &&
				(getType(column, row) === getType(column + 3, row + 3)) &&
				(getType(column, row) !== '0')) {
				won = true;
			}
		}
	}
}
document.getElementById('field').addEventListener('click', function(e) {
	if (!won && e.target.tagName === 'TH') {
		var column = e.target.cellIndex;
		for (var row = 5; row >= 0; row--) {
			if (getType(column, row) === '0') {
				field[row].cells[e.target.cellIndex].setAttribute('data-type', (player ? 2 : 1));
				checkWin();
				if (won) alert((player ? 'black' : 'white') + ' won');
				player = !player;
				break;
			}
		}
	}
}, false);
document.getElementById('button').addEventListener('click', function() {
	var cells = document.getElementsByTagName('td');
	for (var i=0; i<cells.length; i++) {
		cells[i].setAttribute('data-type', 0);
	}
	won = false;
}, false);